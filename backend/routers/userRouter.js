import express from 'express';
import { createUser } from '../controller/userController.js';
import { loginUser } from '../controller/userController.js';
import { getuser, updateUser } from '../controller/userController.js';
import { googleLogin } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/google-login", googleLogin);
userRouter.get("/user", getuser);
userRouter.put("/user", updateUser);

export default userRouter;