import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some((o) => o && origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
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