import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin:  "http://localhost:5173",
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())




//routes import
import authRouter from "./route/authRoute.js";
import userRouter from "./route/userRoute.js";
import contentRouter from "./route/contentRoute.js";


//routes declaration
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/content", contentRouter)


export default app