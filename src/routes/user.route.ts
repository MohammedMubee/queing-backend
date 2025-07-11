import { Router } from "express";
import { signup,login } from "../controller/user.controller";

const userRouter = Router();
userRouter.post("/signup", signup);
userRouter.post("/login", login);

export default userRouter;
