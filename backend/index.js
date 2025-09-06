import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken";

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  const value = req.header("Authorization");
  if (value != null) {
    const token = value.replace("Bearer ", "");
    jwt.verify(token, "secret", (err, decoded) => {
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

const connectionString =
  "mongodb+srv://yehan:1234@cluster0.tsi6es5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDb");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });


app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

app.listen(5000, () => {
  console.log("Server started at port 5000");
});
