import express from "express"
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { createVideo, getChannelVideos } from "../controller/videoController.js";
import { createShort, getAllShorts } from "../controller/shortController.js";

const contentRouter = express.Router()

// for videoController
contentRouter.post("/upload-video", isAuth, upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]), createVideo);

contentRouter.post("/get-videos", isAuth, getChannelVideos);


//for shortController
contentRouter.post("/upload-short", isAuth, upload.single("short"), createShort)
contentRouter.get("/allshorts", getAllShorts)



export default contentRouter