import Channel from "../model/channelModel.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../model/PostModel.js";



export const createPost = async (req, res) => {
  try {
    const { channelId, content } = req.body;
    const file = req.file; // optional image

    if (!channelId || !content) {
      return res.status(400).json({ message: "Channel ID and content are required" });
    }

    let imageUrl = null;
    if (file) {
      imageUrl = await uploadOnCloudinary(file.path);
    }

    // Create post in DB
    const newPost = await Post.create({
      channel: channelId,
      content,
      image: imageUrl,
    });

    // Update channel post list
    await Channel.findByIdAndUpdate(channelId, {
      $push: { communityPosts: newPost._id },
    });

    res.status(201).json(
      
     newPost
    );
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
};



export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("channel comments.author comments.replies.author") // optional: populate channel info
      .sort({ createdAt: -1 }); // newest first

   return res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
return res.status(500).json({message : "Failed to fetch posts"});
  }
};

