import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())




//routes import
import authRouter from "./route/authRoute.js";


//routes declaration
app.use("/api/auth", authRouter)



export default app