import express from "express";
import { placeBet, getGameStatus } from "../controllers/game.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/bet", auth, placeBet);
router.get("/status", auth, getGameStatus);

export default router; 