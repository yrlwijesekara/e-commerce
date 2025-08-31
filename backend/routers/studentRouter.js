import express from "express";
import Student from "../models/student.js";
import { getStudents } from "../controller/studentController.js";
import { createStudents } from "../controller/studentController.js";

const studentRouter = express.Router();

studentRouter.get("/",getStudents);

studentRouter.post("/",createStudents);
export default studentRouter;