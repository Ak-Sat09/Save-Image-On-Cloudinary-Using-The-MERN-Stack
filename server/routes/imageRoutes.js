import express from 'express';
import { getImages, uploadImage } from '../controller/imageController.js';
import upload from '../upload/multer.js';

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);
router.get("/images", getImages);

export default router;