import express from "express"
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { addComment, addReply, addView, createVideo, getChannelVideos, toggleDislikeVideo, toggleLikeVideo, toggleSaveVideo } from "../controller/videoController.js";
import { createShort, getAllShorts } from "../controller/shortController.js";

const contentRouter = express.Router()

// for videoController
contentRouter.post("/upload-video", isAuth, upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]), createVideo);

contentRouter.post("/get-videos", isAuth, getChannelVideos);
// 👍 Like video
contentRouter.put("/video/:videoId/toggle-like", isAuth, toggleLikeVideo);

// 👎 Dislike video
contentRouter.put("/video/:videoId/toggle-dislike", isAuth, toggleDislikeVideo);

// 💾 Save / Unsave video
contentRouter.put("/video/:videoId/toggle-save", isAuth, toggleSaveVideo);
// 👁️ Add view
contentRouter.put("/video/:videoId/add-view", addView);

// 💬 Add comment
contentRouter.post("/video/:videoId/comment", isAuth, addComment);

// 💬 Add reply to comment
contentRouter.post("/video/:videoId/:commentId/reply", isAuth, addReply);


//for shortController
contentRouter.post("/upload-short", isAuth, upload.single("short"), createShort)
contentRouter.get("/allshorts", getAllShorts)



export default contentRouter