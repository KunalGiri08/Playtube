import express from "express"
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";
import { addComment, addReply, addView, createVideo, deleteVideo, fetchVideo, getAllVideos, getChannelVideos, getLikedVideos, getSavedVideos, toggleDislikeVideo, toggleLikeVideo, toggleSaveVideo, updateVideo } from "../controller/videoController.js";
import { addCommentforShort, addReplyforShort, addViewforShort, createShort, deleteShort, fetchShort, getAllShorts, getLikedShorts, getSavedShorts, toggleDislikeShort, toggleLikeShort, toggleSaveShort, updateShort } from "../controller/shortController.js";
import { createPlaylist, deletePlaylist, fetchPlaylist, getSavedPlaylists, toggleSavePlaylist, updatePlaylist } from "../controller/playlistController.js";
import { addCommentInPost, addReplyInPost, createPost, deletePost, getAllPosts, toggleLikePost } from "../controller/postController.js";
import { filterCategoryWithAi, searchWithAi } from "../controller/aiController.js";

const contentRouter = express.Router()

// for videoController
contentRouter.post("/upload-video", isAuth, upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]), createVideo);
// Get channel videos
contentRouter.post("/get-videos", isAuth, getChannelVideos);
// Get all videos
contentRouter.get("/allvideos", getAllVideos)
// 👍 Like video
contentRouter.put("/video/:videoId/toggle-like", isAuth, toggleLikeVideo);

// 👎 Dislike video
contentRouter.put("/video/:videoId/toggle-dislike", isAuth, toggleDislikeVideo);

// 💾 Save / Unsave video
contentRouter.put("/video/:videoId/toggle-save", isAuth, toggleSaveVideo);
// 👁️ Fetch video
contentRouter.get("/fetch-video/:videoId", isAuth, fetchVideo);
// 👁️ Update video
contentRouter.put("/update-video/:videoId",isAuth,upload.single("thumbnail"),updateVideo);
// 🗑️ Delete video
contentRouter.delete("/delete-video/:videoId",isAuth,deleteVideo);

// 👁️ Add view
contentRouter.put("/video/:videoId/add-view", addView);

// 💬 Add comment
contentRouter.post("/video/:videoId/comment", isAuth, addComment);

// 💬 Add reply to comment
contentRouter.post("/video/:videoId/:commentId/reply", isAuth, addReply);
// Get liked videos
contentRouter.get("/likedvideos",isAuth, getLikedVideos)
// Get saved videos
contentRouter.get("/savevideos",isAuth, getSavedVideos)




//for shortController
// Upload short
contentRouter.post("/upload-short", isAuth, upload.single("short"), createShort)
// Get all shorts
contentRouter.get("/allshorts", getAllShorts)
// Get channel shorts
contentRouter.put("/update-short/:shortId",isAuth,updateShort);
// 🗑️ Delete short
contentRouter.delete("/delete-short/:shortId",isAuth,deleteShort);
// 👁️ Fetch short
contentRouter.get("/fetch-short/:shortId", isAuth, fetchShort);


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
// Get liked shorts
contentRouter.get("/likedshorts",isAuth, getLikedShorts)
// Get saved shorts
contentRouter.get("/saveshorts",isAuth, getSavedShorts)




// for postController
contentRouter.post("/create-post",isAuth,upload.single("image"),createPost);

contentRouter.delete("/delete-post/:postId", isAuth, deletePost);

contentRouter.put("/post/toggle-like", isAuth, toggleLikePost);

// 💬 Add comment Post
contentRouter.post("/post/comment", isAuth, addCommentInPost);

// 💬 Add reply to comment Post
contentRouter.post("/post/reply", isAuth, addReplyInPost);

contentRouter.get("/allposts", getAllPosts)



//for  playlistController
contentRouter.post("/create-playlist",isAuth,createPlaylist);

contentRouter.get("/fetch-playlist/:playlistId", fetchPlaylist);

contentRouter.put("/update-playlist/:playlistId", isAuth, updatePlaylist);

contentRouter.delete("/delete-playlist/:playlistId", isAuth, deletePlaylist);

contentRouter.post("/playlist/toggle-save" , isAuth , toggleSavePlaylist)

contentRouter.get("/saveplaylist",isAuth,getSavedPlaylists)



// for Ai Controller

contentRouter.post("/search" , isAuth , searchWithAi)
contentRouter.post("/filter" , isAuth , filterCategoryWithAi)



export default contentRouter