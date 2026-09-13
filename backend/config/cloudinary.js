import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.API_KEY || process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.API_SECRET || process.env.CLOUDINARY_API_SECRET,
    });

    try {
        if (!filePath) return null;

        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });

        // Sirf actual local file ko delete karo
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return result.secure_url;
    } catch (error) {
        console.error("CLOUDINARY ERROR:", error?.message || error);

        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (unlinkErr) {
                console.error("Error removing local temp file:", unlinkErr?.message);
            }
        }

        throw error;
    }
};

export default uploadOnCloudinary;