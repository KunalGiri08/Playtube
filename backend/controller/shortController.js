import Channel from "../model/channelModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Short from "../model/shortModel.js";




export const createShort = async (req, res) => {
  try {
    const { title, description, tags, channelId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Shorts video is required" });
    }

    // Upload to Cloudinary
    const videoUpload = await uploadOnCloudinary(file.path);

    // Create short in DB
    const newShort = await Short.create({
      title,
      description,
      tags: tags ? JSON.parse(tags) : [],
      channel: channelId,
      shortUrl: videoUpload,
    });

    // Update channel shorts list
    await Channel.findByIdAndUpdate(channelId, {
      $push: { shorts: newShort._id },
    });

    res.status(201).json({
      message: "Short created successfully",
      short: newShort,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating short", error: error.message });
  }
};


