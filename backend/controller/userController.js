import User from "../model/userModel.js";

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
    const { name, description ,category} = req.body;
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
