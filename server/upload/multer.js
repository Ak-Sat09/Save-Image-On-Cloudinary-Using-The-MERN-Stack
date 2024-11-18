import multer from 'multer';

// Define storage option for multer (memory storage, storing files in memory)
const storage = multer.memoryStorage();

// Allowed MIME types for file uploads (image, video, audio, etc.)
const allowedTypes = [
  'image/jpeg', 'image/png', 'image/gif',        // Images
  'audio/mpeg', 'audio/wav',                    // Audio
  'video/mp4',                                 // Video
  'application/pdf',                           // PDF
  'application/zip',                           // Zip file
  'application/vnd.android.package-archive'    // .apk files
];

// File filter for multer to allow only specific file types
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Allow the file
  } else {
    cb(new Error('Invalid file type!'), false);  // Reject the file
  }
};

// Create the multer upload instance with memory storage and file filter
const upload = multer({ storage, fileFilter });

// Export the upload middleware as default
export default upload;
