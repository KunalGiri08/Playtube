import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        default: ""
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel"
    },
     // 🔐 OTP reset system
  resetOtp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    isOtpVerifed: {
        type: Boolean,
        default: false
    },


}, { timestamps: true })

const User = mongoose.model("User", userSchema)

export default User;