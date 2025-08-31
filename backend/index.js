import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Student from './models/student.js';


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
    console.log(req.body)
    const student = new Student(
        {
            name: req.body.name,
            age: req.body.age,
            email: req.body.email
        }
    );
    student.save().then(()=>{
        res.json("Student added successfully");
    }).catch((error)=>{
        console.error("Error adding student:", error);
        res.json("Internal server error");
    });
})

app.listen(5000,()=>{
    console.log("Server started at port 5000");
}

)