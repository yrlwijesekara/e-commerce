import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(cors());

// Middleware to verify JWT and attach user info to req.user
app.use((req, res, next) => {
  const value = req.header("Authorization");
  if (value != null) {
    const token = value.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded == null) {
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        req.user = decoded;
        
        next();
      }
    });
  } else {
    next();
  }
});

const connectionString = process.env.Mongo_uri;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDb");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


app.use("/api/users", userRouter);
app.use("/api/roducts", productRouter);

app.listen(5000, () => {
  console.log("Server started at port 5000");
});
