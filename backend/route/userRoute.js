import express from "express";
import isAuth from "../middleware/isAuth.js";
import { createChannel, getCurrentUser } from "../controller/userController.js";

const userRouter = express.Router();

userRouter.get("/getcurrentuser", isAuth, getCurrentUser);

userRouter.post("/create-channel", isAuth , upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 }
  ]) , createChannel)

export default userRouter;