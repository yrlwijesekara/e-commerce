import express from 'express';

let app = express();

app.get("/",(req,res)=>{
    console.log("Received a GET request");
    res.json("Hello World");
})
app.post("/",(req,res)=>{
    console.log("Received a post request");
    res.json("Hello World from post");
})

app.listen(5000,()=>{
    console.log("Server started at port 5000");
}

)