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




