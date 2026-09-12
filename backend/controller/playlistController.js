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



export const fetchPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId)
      .populate("channel", "name avatar")
      .populate({
        path: "videos",
        populate: { path: "channel", select: "name avatar" },
        

      });

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    return res.status(200).json({ playlist });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return res
      .status(500)
      .json({ message: "Error fetching playlist", error: error.message });
  }
};


export const updatePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { title, description, addVideos = [], removeVideos = [] } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // ✅ Update title & description
    if (title) playlist.title = title;
    if (description) playlist.description = description;

    // ✅ Add videos (avoid duplicates)
    playlist.videos.push(...addVideos);
    playlist.videos = [...new Set(playlist.videos.map(v => v.toString()))];

    // ✅ Remove videos
    playlist.videos = playlist.videos.filter(
      vid => !removeVideos.includes(vid.toString())
    );

    await playlist.save();

    res.status(200).json({
      message: "Playlist updated successfully",
      playlist
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating playlist",
      error: error.message
    });
  }
};

// ---------------- DELETE PLAYLIST ----------------
export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // remove playlist reference from channel
    await Channel.findByIdAndUpdate(playlist.channel, {
      $pull: { playlists: playlist._id },
    });

    // delete playlist
    await Playlist.findByIdAndDelete(playlistId);

    return res.status(200).json({
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return res
      .status(500)
      .json({ message: "Error deleting playlist", error: error.message });
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

    res.status(200).json(savedPlaylists || []);
  } catch (error) {
    console.error("Error fetching saved playlists:", error);
    res.status(500).json({
      message: "Server error while fetching saved playlists",
    });
  }
};