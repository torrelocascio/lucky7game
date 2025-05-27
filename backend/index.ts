import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./src/api/routes/user.js";
import gameRoutes from "./src/api/routes/game.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/game", gameRoutes);

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lucky7";

console.log('MongoDB URI:', MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });