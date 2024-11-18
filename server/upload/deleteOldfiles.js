// deleteOldFiles.js
import cron from 'node-cron';
import Image from '../models/imageModel.js';
import cloudinary from '../CloudinaryConfig.js';

// Schedule the job to run every minute
cron.schedule('* * * * *', async () => {
    try {
        // Get the current time minus 24 hours
        const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Find images older than 24 hours
        const oldImages = await Image.find({ createdAt: { $lt: cutoffTime } });

        // Loop through the images and delete them from Cloudinary and MongoDB
        for (const image of oldImages) {
            // Extract the Cloudinary public ID
            const publicId = image.url.split('/').pop().split('.')[0];

            // Delete the file from Cloudinary
            await cloudinary.uploader.destroy(publicId, { resource_type: "image" });  // Assuming all files are images

            // Delete the file record from MongoDB
            await Image.findByIdAndDelete(image._id);
        }

        console.log('Old files deleted successfully.');
    } catch (error) {
        console.error('Error deleting old files:', error);
    }
});
