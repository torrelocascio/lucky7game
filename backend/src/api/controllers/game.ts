import { Request, Response } from "express";
import User from "../../models/user.js";
import { UserDocument } from "../../types/index.js";
import Game from "../../models/game.js";
import { AuthRequest } from "../../types/index.js";

let currentGameTimeout: NodeJS.Timeout | null = null;
let lastRollTime: number = Date.now();
let currentBets: Array<{
  userId: string;
  betAmount: number;
  betOnLucky7: boolean;
}> = [];

const rollDice = () => {
  return Math.floor(Math.random() * 6) + 1;
};

const processGame = async () => {
  const dice1 = rollDice();
  const dice2 = rollDice();
  const diceSum = dice1 + dice2;
  const isLucky7 = diceSum === 7;

  for (const bet of currentBets) {
    const user = await User.findById(bet.userId);
    if (!user) continue;

    const won = bet.betOnLucky7 ? isLucky7 : !isLucky7;
    const winnings = won ? (bet.betOnLucky7 ? bet.betAmount * 7 : bet.betAmount) : 0;

    if (won) {
      user.tokens += winnings;
      await user.save();
    }

    await Game.create({
      userId: bet.userId,
      betAmount: bet.betAmount,
      betOnLucky7: bet.betOnLucky7,
      diceSum,
      won,
      winnings
    });
  }

  currentBets = [];
  lastRollTime = Date.now();
  currentGameTimeout = setTimeout(processGame, 15000);
};

// Start the game loop
processGame();

export const placeBet = async (req: AuthRequest, res: Response) => {
  try {
    const { betAmount, betOnLucky7 } = req.body;
    const userId = req.user?.id;

    console.log('Placing bet for user:', userId);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId).exec() as UserDocument | null;
    if (!user) {
      console.error('User not found:', userId);
      return res.status(404).json({ message: "User not found" });
    }

    if (user.tokens < betAmount) {
      return res.status(400).json({ message: "Insufficient tokens" });
    }

    const timeSinceLastRoll = Date.now() - lastRollTime;
    if (timeSinceLastRoll > 10000) {
      return res.status(400).json({ message: "Betting period has ended" });
    }

    // Deduct tokens immediately
    user.tokens -= betAmount;
    await user.save();

    // Add bet to current game
    currentBets.push({
      userId,
      betAmount,
      betOnLucky7
    });

    res.status(200).json({
      message: "Bet placed successfully",
      remainingTokens: user.tokens
    });
  } catch (error) {
    console.error('Error placing bet:', error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getGameStatus = async (req: Request, res: Response) => {
  try {
    const timeSinceLastRoll = Date.now() - lastRollTime;
    const timeUntilNextRoll = Math.max(0, 15000 - timeSinceLastRoll);
    const canBet = timeSinceLastRoll <= 10000;

    res.status(200).json({
      timeUntilNextRoll,
      canBet,
      lastRollTime
    });
  } catch (error) {
    console.error('Error getting game status:', error);
    res.status(500).json({ message: "Something went wrong" });
  }
}; 