import express from 'express';
import dotenv  from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import './upload/deleteOldfiles.js';

import router from './routes/imageRoutes.js';

dotenv.config();



const app = express();


// Configure CORS to allow requests from React frontend
const corsOptions = {
    origin: 'http://localhost:3000',  // URL of your React app (frontend)
    methods: 'GET,POST',  // Allow these HTTP methods
    allowedHeaders: 'Content-Type, Authorization',  // Allow these headers
  };
  
  app.use(cors(corsOptions));  // Enable CORS with the defined options
  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI,{}).then(()=>console.log('MongoDb Connected')).catch((error)=>console.log('Error'));

app.use("/api/images", router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));