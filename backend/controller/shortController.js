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



export const getAllShorts = async (req, res) => {
  try {
    const shorts = await Short.find()
      .populate("channel comments.author comments.replies.author") // optional: populate channel info
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(shorts);
  } catch (error) {
    console.error("Error fetching shorts:", error);
res.status(500).json({message : "Failed to fetch short"});
  }
};



// ---------------- LIKE VIDEO ----------------
export const toggleLikeShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId; // ✅ auth middleware se aayega

    const short = await Short.findById(shortId);
    if (!short) return res.status(404).json({ message: "short not found" });

    if (short?.likes.includes(userId)) {
      // already liked → remove
      short.likes.pull(userId);
    } else {
      // add like → remove dislike if exists
      short?.likes.push(userId);
      short?.dislikes.pull(userId);
    }

    await short.save();
     await short.populate("comments.author", "username photoUrl");
    await short.populate("channel")
     await short.populate("comments.replies.author", "username photoUrl");
   return res.status(200).json(short);
  } catch (error) {
  return  res.status(500).json({ message: "Error toggling like", error: error.message });
  }
};

// ---------------- DISLIKE VIDEO ----------------
export const toggleDislikeShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) return res.status(404).json({ message: "short not found" });

    if (short.dislikes.includes(userId)) {
      short.dislikes.pull(userId);
    } else {
      short.dislikes.push(userId);
      short.likes.pull(userId);
    }
 await short.populate("comments.author", "username photoUrl");
    await short.populate("channel")
     await short.populate("comments.replies.author", "username photoUrl");
    await short.save();
    return res.status(200).json(short);
  } catch (error) {
    return res.status(500).json({ message: "Error toggling dislike", error: error.message });
  }
};

// ---------------- ADD COMMENT ----------------
// ---------------- ADD COMMENT ----------------
export const addCommentforShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    // pehle video lao
    const short = await Short.findById(shortId);
    if (!short) return res.status(404).json({ message: "short not found" });

    // comment TOP pe add karo
    short.comments.unshift({ author: userId, message });
    await short.save();
 await short.populate("comments.author", "username photoUrl");
    await short.populate("channel")
     await short.populate("comments.replies.author", "username photoUrl");

    return res.status(201).json(short);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding comment", error: error.message });
  }
};

// ---------------- ADD REPLY ----------------
export const addReplyforShort = async (req, res) => {
  try {
    const { shortId, commentId } = req.params;
    const { message } = req.body;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) return res.status(404).json({ message: "Video not found" });

    const comment = short.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // reply TOP pe add karo
    comment.replies.unshift({ author: userId, message });
    await short.save();
      await short.populate("comments.author", "username photoUrl");
    await short.populate("channel")
     await short.populate("comments.replies.author", "username photoUrl");

    return res.status(201).json(short);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding reply", error: error.message });
  }
};


// ---------------- ADD VIEW ----------------
export const addViewforShort = async (req, res) => {
  try {
    const { shortId } = req.params;

    const short = await Short.findByIdAndUpdate(
      shortId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!short) return res.status(404).json({ message: "Video not found" });

      await short.populate("comments.author", "username photoUrl");
    await short.populate("channel")
     await short.populate("comments.replies.author", "username photoUrl");

   return res.status(200).json(short);
  } catch (error) {
   return res.status(500).json({ message: "Error adding view", error: error.message });
  }
};

// ---------------- TOGGLE SAVE ----------------
export const toggleSaveShort = async (req, res) => {
  try {
    const { shortId } = req.params;
    const userId = req.userId;

    const short = await Short.findById(shortId);
    if (!short) return res.status(404).json({ message: "Video not found" });

    if (short.saveBy.includes(userId)) {
      short.saveBy.pull(userId);
    } else {
      short.saveBy.push(userId);
    }
    await short.populate("comments.author", "username photoUrl");
    await short.populate("channel")
     await short.populate("comments.replies.author", "username photoUrl");

    await short.save();
   return res.status(200).json(short);
  } catch (error) {
   return res.status(500).json({ message: "Error toggling save", error: error.message });
  }
};

// ---------------- Get Liked Shorts ----------------
export const getLikedShorts = async (req, res) => {
  try {
    const userId = req.userId; // middleware se aayega
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Find shorts jisme likes me userId hai
    const likedShorts = await Short.find({ likes: userId })
      .populate("channel", "name avatar")
      .populate("likes", "username");

    res.status(200).json(likedShorts || []);
  } catch (error) {
    console.error("Error fetching liked shorts:", error);
    res.status(500).json({
      message: "Server error while fetching liked shorts",
    });
  }
};

// ---------------- Get Saved Shorts ----------------
export const getSavedShorts = async (req, res) => {
  try {
    const userId = req.userId; // ✅ Middleware se aa rahi hai
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Find videos jisme userId saveBy array me ho
    const savedShorts = await Short.find({ saveBy: userId })
      .populate("channel", "name avatar") // channel info include karo
      .populate("saveBy", "username");    // optional: dekhna kaun save kar chuka hai

    if (!savedShorts || savedShorts.length === 0) {
      return res.status(404).json({ message: "No saved videos found" });
    }

    res.status(200).json(savedShorts);
  } catch (error) {
    console.error("Error fetching saved shorts:", error);
    res.status(500).json({
      message: "Server error while fetching saved shorts",
    });
  }
};