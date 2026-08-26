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


// ---------------- LIKE VIDEO ----------------
export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.userId; // ✅ auth middleware se aayega

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      // already liked → remove
      post.likes.pull(userId);
    } else {
      // add like → remove dislike if exists
      post.likes.push(userId);
      
    }

    await post.save();
   return res.status(200).json(post);
  } catch (error) {
  return  res.status(500).json({ message: "Error toggling like", error: error.message });
  }
};

// ---------------- ADD COMMENT ----------------
export const addCommentInPost = async (req, res) => {
  try {
    const { postId } = req.body;
    const { message } = req.body;
    const userId = req.userId;

    // pehle video lao
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // comment push karo
    post.comments.push({ author: userId, message });
    await post.save();

    // ✅ ab dobara fetch karo with nested populate
    const populatedPost = await Post.findById(postId)
      .populate({
        path: "comments.author",
        select: "username photoUrl email"
      })
      .populate({
        path: "comments.replies.author",
        select: "username photoUrl email"
      });

    return res.status(201).json(populatedPost);
  } catch (error) {
    return res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};


// ---------------- ADD REPLY ----------------
export const addReplyInPost = async (req, res) => {
  try {
    const { postId, commentId } = req.body;
    const { message } = req.body;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies.push({ author: userId, message });
    await post.save();

    // ✅ again fetch with populate
    const populatedPost = await Post.findById(postId)
      .populate({
        path: "comments.author",
        select: "username photoUrl email"
      })
      .populate({
        path: "comments.replies.author",
        select: "username photoUrl email"
      });

    return res.status(201).json(populatedPost);
  } catch (error) {
    return res.status(500).json({ message: "Error adding reply", error: error.message });
  }
};