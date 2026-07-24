import dns from "dns";
dns.setServers(['8.8.8.8', '1.1.1.1']);
import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./route/authRoute.js";
dotenv.config();
const port = process.env.PORT

const app = express()
app.use(cookieParser())
app.use(express.json())



app.use("/api/auth", authRouter)



app.listen(port, () => {
    console.log("Server Started")
    connectDb();
})