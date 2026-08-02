import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../model/channelModel.js";
import Video from "../model/videoModel.js";
import User from "../model/userModel.js";

export const createVideo = async (req, res) => {
  try {
    const { title, description, tags, channel } = req.body;

    // Validate required fields
    if (!title || !req.files?.video || !req.files?.thumbnail || !channel) {
      return res.status(400).json({
        message: "Video, thumbnail, title, and channel ID are required"
      });
    }

    // Get channel by ID
    const channelData = await Channel.findById(channel);
    if (!channelData) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Upload video to Cloudinary
    const uploadedVideo = await uploadOnCloudinary(req.files.video[0].path);

    // Upload thumbnail to Cloudinary
    const uploadedThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path);

    // Parse tags
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = [];
      }
    }

    // Create video
    const newVideo = await Video.create({
      channel: channelData._id,
      title,
      description: description || "",
      videoUrl: uploadedVideo,
      thumbnail: uploadedThumbnail,
      tags: parsedTags
    });

    // ✅ Add video to channel's videos array
   await Channel.findByIdAndUpdate(
  channelData._id,
  { $push: { videos: newVideo._id } },
  { new: true } // returns updated doc
);

    // Return updated channel along with new video
   return res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo
    });

  } catch (error) {
    console.error("Error creating video:", error);
   return res.status(500).json({
      message: "Error creating video",
      error: error.message
    });
  }
};


// Get all videos from a channel (for playlist selection)
export const getChannelVideos = async (req, res) => {
  try {
    const { channelId } = req.body;

    if (!channelId) {
      return res.status(400).json({ message: "Channel ID is required" });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const videos = await Video.find({ channel: channelId })
      .select("title thumbnail createdAt")
      .sort({ createdAt: -1 });

   return res.status(200).json({ videos });
  } catch (error) {
   return res.status(500).json({
      message: "Error fetching channel videos",
      error: error.message
    });
  }
};

