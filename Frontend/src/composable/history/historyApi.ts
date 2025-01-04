import axios from 'axios';
import { API_URL, API_HISTORIES_URL } from '@/constants';

export const historyApi = {
  async getAllHistories(token: string) {
    return await axios.get(`${API_URL}${API_HISTORIES_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getHistoryById(historyId: number, token: string) {
    return await axios.get(`${API_URL}${API_HISTORIES_URL}/${historyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getHistoriesByUserId(userId: number, token: string) {
    return await axios.get(`${API_URL}${API_HISTORIES_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createHistory(token: string, data: { idUser: number; idGame: number }) {
    return await axios.post(`${API_URL}${API_HISTORIES_URL}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateHistory(
    token: string,
    historyId: number,
    data: { idUser?: number; idGame?: number }
  ) {
    return await axios.patch(`${API_URL}${API_HISTORIES_URL}/${historyId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async deleteHistory(token: string, historyId: number) {
    return await axios.delete(`${API_URL}${API_HISTORIES_URL}/${historyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
