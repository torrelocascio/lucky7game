import axios from 'axios';
import { UserData } from '../types/actionTypes';

const API_URL = 'http://localhost:3001/api';

export const fetchUserData = async (token: string): Promise<UserData | null> => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/user/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const updatePassword = async (token: string, currentPassword: string, newPassword: string) => {
  try {
    const response = await axios.post(`${API_URL}/user/change-password`, 
      { currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}; 