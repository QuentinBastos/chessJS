import axios from 'axios';
import { API_URL, API_USERS_URL } from '@/constants';

export const userApi = {
  async getAllUsers(token: string) {
    return await axios.get(`${API_URL}${API_USERS_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getUserById(userId: number, token: string) {
    return await axios.get(`${API_URL}${API_USERS_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createUser( data: { username: string; email: string; password: string; rank: number }) {
    return await axios.post(`${API_URL}${API_USERS_URL}/`, data);
  },

  async deleteUser(token: string, userId: number) {
    return await axios.delete(`${API_URL}${API_USERS_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateUser(token: string, userId: number, data: { username?: string; email?: string; password?: string; rank?: number }) {
    return await axios.patch(`${API_URL}${API_USERS_URL}/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
