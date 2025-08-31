import e from "express";
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String
});

const Student = mongoose.model("Students", studentSchema);

export default Student;