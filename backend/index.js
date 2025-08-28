import express from 'express';

let app = express();

function started() {
    console.log("Server started at port 3000");
}

app.listen(5000,started)