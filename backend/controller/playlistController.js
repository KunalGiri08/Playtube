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

