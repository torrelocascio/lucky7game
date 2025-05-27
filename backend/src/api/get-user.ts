import { Request, Response } from "express";
import User from "../models/user.js";
import { AuthRequest } from "../types/index.js";

const getUser = async (req: AuthRequest, res: Response) => {
  try {
    console.log("GetUser - Request user:", req.user);
    const userId = req.user?.id;
    console.log("GetUser - User ID:", userId);

    if (!userId) {
      console.log("GetUser - No user ID found");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    console.log("GetUser - Found user:", user);

    if (!user) {
      console.log("GetUser - User not found");
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      tokens: user.tokens
    });
  } catch (error) {
    console.error("GetUser - Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default getUser; 