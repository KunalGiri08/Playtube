import Video from "../model/videoModel.js";
import Channel from "../model/channelModel.js";
import Playlist from "../model/playlistModel.js";


// Create playlist
export const createPlaylist = async (req, res) => {
  try {
    const { title, description, channelId, videoIds } = req.body;

    if (!title || !channelId) {
      return res.status(400).json({ message: "Playlist title and channel ID are required" });
    }

    // Check channel exists
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Verify that all selected videos belong to this channel
    const videos = await Video.find({
      _id: { $in: videoIds },
      channel: channelId
    });

    if (videos.length !== videoIds.length) {
      return res.status(400).json({ message: "Some videos not found in this channel" });
    }

    // Create playlist
    const playlist = await Playlist.create({
      title,
      description: description || "",
      channel: channelId,
      videos: videoIds
    });

    // Add playlist to channel's playlists array
    await Channel.findByIdAndUpdate(channelId, {
      $push: { playlists: playlist._id }
    });

    res.status(201).json({
      message: "Playlist created successfully",
      playlist
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating playlist",
      error: error.message
    });
  }
};

// ---------------- TOGGLE SAVE ----------------
export const toggleSavePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body;
    const userId = req.userId;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "playlist not found" });

    if (playlist.saveBy.includes(userId)) {
      playlist.saveBy.pull(userId);
    } else {
      playlist.saveBy.push(userId);
    }

    await playlist.save();
   return res.status(200).json(playlist);
  } catch (error) {
   return res.status(500).json({ message: "Error toggling save", error: error.message });
  }
};

// ---------------- GET SAVED PLAYLISTS ----------------
export const getSavedPlaylists = async (req, res) => {
  try {
    const userId = req.userId; // ✅ middleware se user ki id aa rahi hai na, ensure kar lena

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Find playlists jisme user ki id saveBy array me hai
    const savedPlaylists = await Playlist.find({
      saveBy: userId,
    })
      .populate("channel", "name avatar") // channel info
      .populate({
        path: "videos",
        populate: { path: "channel", select: "name avatar" }, // videos ke andar channel details
      });

    if (!savedPlaylists || savedPlaylists.length === 0) {
      return res.status(404).json({ message: "No saved playlists found" });
    }

    res.status(200).json(savedPlaylists);
  } catch (error) {
    console.error("Error fetching saved playlists:", error);
    res.status(500).json({
      message: "Server error while fetching saved playlists",
    });
  }
};