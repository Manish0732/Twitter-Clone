import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from 'cloudinary';

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationsRoutes from "./routes/notification.routes.js";
import connectToMOngoDB from "./db/connectToMongoDB.js";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan("dev")); // morgan for console level request tracking.

app.use(express.json()); // to parse req.body
app.use(express.urlencoded({ extended: true })); // to parse form data

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationsRoutes);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
  connectToMOngoDB();
});
