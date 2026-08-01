import express from "express"
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { createVideo } from "../controller/videoController.js";

const contentRouter = express.Router()
  
// for videoController
contentRouter.post("/upload-video",isAuth,upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),createVideo);




  export default contentRouter