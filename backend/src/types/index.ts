import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Document } from 'mongoose';

export interface UserDocument extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  id?: string;
  tokens: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface PasswordChangeRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface UserJwtPayload extends JwtPayload {
  _id: string;
  name: string;
  email: string;
  password: string;
  tokens: number;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}