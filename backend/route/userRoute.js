import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  addToHistory,
  createChannel,
  getAllChannel,
  getChannel,
  getCurrentUser,
  getHistory,
  getRecommendedContent,
  getSubscribedContent,
  toggleSubscribe,
  updateChannel,
} from "../controller/userController.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.get("/getcurrentuser", isAuth, getCurrentUser);

userRouter.post(
  "/createchannel",
  isAuth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  createChannel,
);
userRouter.get("/getchannel", isAuth, getChannel);
userRouter.post(
  "/updatechannel",
  isAuth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  updateChannel,
);
userRouter.get("/getallchannel", getAllChannel);
userRouter.post("/subscribe", isAuth, toggleSubscribe);
userRouter.get("/subscribedcontent", isAuth, getSubscribedContent);
userRouter.post("/addhistory", isAuth, addToHistory);
userRouter.get("/gethistory", isAuth, getHistory);
  userRouter.get("/getrecommendation",isAuth,getRecommendedContent)

export default userRouter;
