import User from "../model/userModel.js";
import Channel from "../model/channelModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";


export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({
      message: `getCurrentUser error ${error}`
    });
  }
};

// Create Channel
export const createChannel = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const userId = req.userId;

    // Check if user already has a channel
    const existingChannel = await Channel.findOne({ owner: userId });
    if (existingChannel) {
      return res.status(400).json({ message: "User already has a channel" });
    }

    // Check if channel name already exists
    const nameExists = await Channel.findOne({ name });
    if (nameExists) {
      return res.status(400).json({ message: "Channel name already taken" });
    }

    let avatar;
    let bannerImage;

    if (req.files?.avatar) {
      avatar = await uploadOnCloudinary(req.files.avatar[0].path);
    }
    if (req.files?.bannerImage) {
      bannerImage = await uploadOnCloudinary(req.files.bannerImage[0].path);
    }

    // Create channel
    const newChannel = await Channel.create({
      name,
      description,
      avatar,
      bannerImage,
      owner: userId,
      category
    });

    // Update user: set username = channel name & photoUrl = avatar
    await User.findByIdAndUpdate(userId, {
      channel: newChannel._id,
      username: name,
      photoUrl: avatar
    });

    res.status(201).json(
      newChannel
    );
  } catch (error) {
    res.status(500).json({ message: "Error creating channel", error: error.message });
  }
};


// Get Channel for Logged-in User
export const getChannel = async (req, res) => {
  try {
    const userId = req.userId; // from isAuth middleware

    const channel = await Channel.findOne({ owner: userId })
      .populate("owner")


    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    return res.status(200).json(channel);
  } catch (error) {
    console.error("Get Channel Error:", error);
    return res.status(500).json({
      message: "Error fetching channel",
      error: error.message,
    });
  }
};

// Update Channel
export const updateChannel = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const userId = req.userId;

    // Find channel owned by user
    const channel = await Channel.findOne({ owner: userId });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Check if new name is already taken (by another channel)
    if (name && name !== channel.name) {
      const nameExists = await Channel.findOne({ name });
      if (nameExists) {
        return res.status(400).json({ message: "Channel name already taken" });
      }
      channel.name = name;
    }

    // Update text fields
    if (description !== undefined) channel.description = description;
    if (category !== undefined) channel.category = category;

    // Handle file uploads (avatar & bannerImage)
    if (req.files?.avatar) {
      const avatar = await uploadOnCloudinary(req.files.avatar[0].path);
      channel.avatar = avatar;
    }
    if (req.files?.bannerImage) {
      const bannerImage = await uploadOnCloudinary(req.files.bannerImage[0].path);
      channel.bannerImage = bannerImage;
    }

    // Save updated channel
    const updatedChannel = await channel.save();


    // Optionally update user's username & photo if channel name/avatar changes
    await User.findByIdAndUpdate(userId, {
      username: name || undefined,
      photoUrl: channel.avatar || undefined
    }, { new: true });

    return res.status(200).json(updatedChannel);
  } catch (error) {
    console.error("Update Channel Error:", error);
    return res.status(500).json({ message: "Error updating channel", error: error.message });
  }
};


export const toggleSubscribe = async (req, res) => {
  try {
    const { channelId } = req.body;   // ✅ body se channelId
    const userId = req.userId;        // ✅ middleware se userId (JWT auth)

    if (!channelId) {
      return res.status(400).json({ message: "channelId is required" });
    }

    // 🔎 Channel find karo
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // 🔁 Check if user already subscribed
    const isSubscribed = channel?.subscribers?.includes(userId);

    if (isSubscribed) {
      // ❌ unsubscribe
      channel.subscribers.pull(userId);
    } else {
      // ✅ subscribe
      channel.subscribers.push(userId);
    }

    await channel.save();

    // ✅ Save ke baad updated channel wapas fetch karo with populate
    const updatedChannel = await Channel.findById(channelId)
      .populate("owner")
      .populate("videos")
      .populate("shorts")
      .populate("communityPosts")
      .populate({
        path: "playlists",
        populate: {
          path: "videos",
          model: "Video",
          populate: {
            path: "channel",
            model: "Channel",
          },
        },
      });

     

    return res.status(200).json(updatedChannel);

  } catch (error) {
    res.status(500).json({
      message: "Error toggling subscription",
      error: error.message,
    });
  }
};
// Get All Channels 
export const getAllChannel = async (req,res) => {
  try {
    const channel = await Channel.find() .populate("owner")
    
      .populate("videos")
      .populate("shorts")
      .populate("subscribers")
      .populate({
        path: "communityPosts",
        populate: {
          path: "channel",
          model: "Channel",
         
        },
       })
       .populate({
        path: "playlists",
        populate: {
          path: "videos",
          model: "Video",
          populate: {
            path: "channel", // video ke andar channel populate hoga
            model: "Channel",
          },
        },
      });

    
    if(!channel){
      return res.status(400).json({message:"Channel is not found"})
    }

    return res.status(200).json(channel)

  } catch (error) {
    console.error("Get All Channel Error:", error);
    return res.status(500).json({
      message: "Error fetching channel",
      error: error.message,
    });
  }
}






// Get Subscribed Content (Videos & Shorts) for Logged-in User
export const getSubscribedContent = async (req, res) => {
  try {
    const userId = req.userId; // ✅ make sure user middleware se aa raha hai

    // Find all channels where user is a subscriber
    const subscribedChannels = await Channel.find({
      subscribers: userId,
    })
      .populate({
        path: "videos",
        populate: { path: "channel", select: "name avatar" }, // video ke andar channel details
      })
      .populate({
        path: "shorts",
        populate: { path: "channel", select: "name avatar" }, // short ke andar channel details
      });

    if (!subscribedChannels || subscribedChannels.length === 0) {
      return res.status(404).json({ message: "No subscribed channels found" });
    }

    // Separate out videos and shorts from all subscribed channels
    const videos = subscribedChannels.flatMap((ch) => ch.videos);
    const shorts = subscribedChannels.flatMap((ch) => ch.shorts);

    res.status(200).json({
      subscribedChannels,
      videos,
      shorts,
    });
  } catch (error) {
    console.error("Error fetching subscribed content:", error);
    res.status(500).json({
      message: "Server error while fetching subscribed content"
    });
  }
};

// Add to User History
export const addToHistory = async (req, res) => {
  try {
    const userId = req.userId; // isAuth middleware se
    const { contentId, contentType } = req.body; // { contentId: "...", contentType: "Video" ya "Short" }

    // ✅ check valid type
    if (!["Video", "Short"].includes(contentType)) {
      return res.status(400).json({ message: "Invalid contentType" });
    }

    // ✅ DB me content exist karta hai ya nahi
    let content;
    if (contentType === "Video") {
      content = await Video.findById(contentId);
    } else {
      content = await Short.findById(contentId);
    }
    if (!content) return res.status(404).json({ message: `${contentType} not found` });

    // ✅ Duplicate avoid karna (pehle remove fir push)
    await User.findByIdAndUpdate(userId, {
      $pull: { history: { contentId, contentType } }
    });

    // ✅ Add new entry
    await User.findByIdAndUpdate(userId, {
      $push: {
        history: { contentId, contentType, watchedAt: new Date() }
      }
    });

    res.status(200).json({ message: "Added to history" });
  } catch (err) {
    console.error("❌ addToHistory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// Get User History
export const getHistory = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId)
      .populate({
        path: "history.contentId", // refPath ke basis pe Video ya Short populate hoga
        populate: {
          path: "channel", // ✅ contentId ke andar ka channel populate karega
          select: "name avatar", // sirf avatar aur name bhejega
        },
      })
      .select("history");

    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Latest history upar
    const sortedHistory = [...user.history].sort(
      (a, b) => new Date(b.watchedAt) - new Date(a.watchedAt)
    );

    res.status(200).json(sortedHistory);
  } catch (err) {
    console.error("❌ History fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Recommended Content based on User History, Likes, and Saves
export const getRecommendedContent = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // 🟢 Get user with history
    const user = await User.findById(userId)
      .populate("history.contentId")
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    // Collect keywords from history
    const historyKeywords = user.history.map(h => h.contentId?.title || "");

    // Collect liked & saved content
    const likedVideos = await Video.find({ likes: userId });
    const likedShorts = await Short.find({ likes: userId });
    const savedVideos = await Video.find({ saveBy: userId });
    const savedShorts = await Short.find({ saveBy: userId });

    const likedSavedKeywords = [
      ...likedVideos.map(v => v.title),
      ...likedShorts.map(s => s.title),
      ...savedVideos.map(v => v.title),
      ...savedShorts.map(s => s.title),
    ];

    // Merge all keywords
    const allKeywords = [...historyKeywords, ...likedSavedKeywords]
      .filter(Boolean)
      .map(k => k.split(" ")) // split words
      .flat();

    // ✅ Build regex conditions
    const videoConditions = [];
    const shortConditions = [];

    allKeywords.forEach(kw => {
      videoConditions.push(
        { title: { $regex: kw, $options: "i" } },
        { description: { $regex: kw, $options: "i" } },
        { tags: { $regex: kw, $options: "i" } }
      );
      shortConditions.push(
        { title: { $regex: kw, $options: "i" } },
        { tags: { $regex: kw, $options: "i" } }
      );
    });

    // ✅ Recommended content
    const recommendedVideos = await Video.find({ $or: videoConditions })
      .populate("channel comments.author comments.replies.author");

    const recommendedShorts = await Short.find({ $or: shortConditions })
      .populate("channel", "name avatar")
      .populate("likes", "username photoUrl");

    // ✅ Remaining content (exclude recommended)
    const recommendedVideoIds = recommendedVideos.map(v => v._id);
    const recommendedShortIds = recommendedShorts.map(s => s._id);

    const remainingVideos = await Video.find({
      _id: { $nin: recommendedVideoIds }
    })
      .sort({ createdAt: -1 })
      .populate("channel");

    const remainingShorts = await Short.find({
      _id: { $nin: recommendedShortIds }
    })
      .sort({ createdAt: -1 })
      .populate("channel");

    return res.status(200).json({
      recommendedVideos,
      recommendedShorts,
      remainingVideos,
      remainingShorts,
      usedKeywords: allKeywords,
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    return res.status(500).json({ message: `Failed: ${error.message}` });
  }
};