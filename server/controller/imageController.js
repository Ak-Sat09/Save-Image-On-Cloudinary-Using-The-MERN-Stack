import cloudinary from "../CloudinaryConfig.js";
import Image from "../models/imageModel.js";  // Keeping the model name as is

export const uploadImage = async (req, res) => {
    try {
        // Check if a file is provided
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded!" });
        }

        // Set Cloudinary options based on file type
        let options = { folder: "uploads" };
        const mimeType = req.file.mimetype;

        // Set resource_type for non-image files
        if (mimeType.startsWith('video/')) {
            options.resource_type = "video";
        } else if (mimeType.startsWith('audio/')) {
            options.resource_type = "video"; // Cloudinary handles audio as video
        } else if (!mimeType.startsWith('image/')) {
            options.resource_type = "raw";  // For documents, APKs, etc.
        }

        // Upload the file to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                options,
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(req.file.buffer);  // Use the buffer data from the file
        });

        // Save the file URL in MongoDB (still using Image model)
        const newFile = new Image({ url: result.secure_url, type: mimeType });
        await newFile.save();

        res.status(200).json({
            message: "File uploaded successfully!",
            url: result.secure_url,
        });
    } catch (error) {
        res.status(500).json({
            message: "File upload failed!",
            error: error.message,
        });
    }
};

// Retrieve all files from MongoDB
export const getImages = async (req, res) => {
    try {
        const files = await Image.find({});  // Still querying the Image model
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch files",
            error: error.message,
        });
    }
};
