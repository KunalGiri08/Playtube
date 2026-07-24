import dns from "dns";
dns.setServers(['8.8.8.8', '1.1.1.1']);

import dotenv from "dotenv"
import connectDb from "./config/db.js";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT || 8000;

connectDb()
.then(() => {
    app.listen(port, () => {
        console.log(`⚙️ Server is running at port : ${port}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})