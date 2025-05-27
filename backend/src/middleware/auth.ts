import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/index.js";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Auth middleware - Headers:", req.headers);
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Auth middleware - Token:", token);

    if (!token) {
      console.log("Auth middleware - No token found");
      return res.status(401).json({ message: "No authentication token, access denied" });
    }

    const verified = jwt.verify(token, "test");
    console.log("Auth middleware - Verified token:", verified);
    (req as AuthRequest).user = { id: (verified as any)._id };
    next();
  } catch (err) {
    console.error("Auth middleware - Error:", err);
    res.status(401).json({ message: "Token verification failed, authorization denied" });
  }
};

export default auth; 