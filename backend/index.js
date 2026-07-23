import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js";
dotenv.config();
import dns from "dns";
dns.setServers(['8.8.8.8', '1.1.1.1']);
const port = process.env.PORT

const app = express()

app.get("/", (req,res)=>{
    res.send("Hello From Server")
})

app.listen(port , ()=>{
    console.log("Server Started")
    connectDb();
})