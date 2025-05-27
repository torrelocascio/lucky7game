import mongoose, { Schema } from "mongoose";

interface IGame {
  userId: mongoose.Types.ObjectId;
  betAmount: number;
  betOnLucky7: boolean;
  diceSum: number;
  won: boolean;
  winnings: number;
  createdAt: Date;
}

const gameSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  betAmount: { type: Number, required: true },
  betOnLucky7: { type: Boolean, required: true },
  diceSum: { type: Number, required: true },
  won: { type: Boolean, required: true },
  winnings: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IGame>("Game", gameSchema); 