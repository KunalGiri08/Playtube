import express from "express"
import upload from "../middleware/multer.js"
import { googleAuth, resetPassword, sendOTP, signIn, signOut, signUp, verifyOTP } from "../controller/authController.js"

const authRouter = express.Router()

authRouter.post("/signup", upload.single("photoUrl"), signUp)
authRouter.post("/signin", signIn)
authRouter.post("/signout", signOut)
authRouter.post("/google-auth", upload.single("photoUrl"), googleAuth);
authRouter.post("/sendotp",sendOTP)
authRouter.post("/verifyotp",verifyOTP)
authRouter.post("/resetpassword",resetPassword)

export default authRouter