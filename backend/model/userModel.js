import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    photoUrl: {
      type: String,
      default: "",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
    // 🔐 OTP reset system
    resetOtp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isOtpVerifed: {
      type: Boolean,
      default: false,
    },
    // 📌 History Field
    history: [
      {
        contentId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "history.contentType", // dynamically decide karega Video ya Short
        },
        contentType: {
          type: String,
          enum: ["Video", "Short"],
          required: true,
        },
        watchedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
