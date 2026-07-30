import express from "express";
import isAuth from "../middleware/isAuth.js";
import { createChannel, getChannel, getCurrentUser, updateChannel } from "../controller/userController.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/getcurrentuser", isAuth, getCurrentUser);

userRouter.post("/createchannel", isAuth, upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 }
]), createChannel)
userRouter.get("/getchannel", isAuth, getChannel);
userRouter.post("/updatechannel", isAuth, upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 }
]), updateChannel)

export default userRouter;