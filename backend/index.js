import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';


const app = express();
app.use(bodyParser.json());
const connectionString = "mongodb+srv://yehan:1234@cluster0.tsi6es5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(connectionString).then(()=>{
    console.log("Connected to MongoDb");
}).catch((error)=>{
    console.error("MongoDB connection error:", error);
});



app.get("/",(req,res)=>{
    console.log("Received a GET request");
    res.json("Hello World");
})
app.post("/",(req,res)=>{
    console.log(req.body);
    res.json("Hello World from post");
})

app.listen(5000,()=>{
    console.log("Server started at port 5000");
}

)