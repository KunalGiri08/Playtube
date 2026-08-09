import express from "express"
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { addComment, addReply, addView, createVideo, getChannelVideos, toggleDislikeVideo, toggleLikeVideo, toggleSaveVideo } from "../controller/videoController.js";
import { addCommentforShort, addReplyforShort, addViewforShort, createShort, getAllShorts, toggleDislikeShort, toggleLikeShort, toggleSaveShort } from "../controller/shortController.js";

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

// 👁️ Add view
contentRouter.put("/short/:shortId/add-view",isAuth, addViewforShort);

// 👍 Like short
contentRouter.put("/short/:shortId/toggle-like", isAuth, toggleLikeShort);

// 👎 Dislike short
contentRouter.put("/short/:shortId/toggle-dislike", isAuth, toggleDislikeShort);

// 💾 Save / Unsave short
contentRouter.put("/short/:shortId/toggle-save", isAuth, toggleSaveShort);

// 💬 Add comment short
contentRouter.post("/short/:shortId/comment", isAuth, addCommentforShort);

// 💬 Add reply to comment short
contentRouter.post("/short/:shortId/:commentId/reply", isAuth, addReplyforShort);





export default contentRouter