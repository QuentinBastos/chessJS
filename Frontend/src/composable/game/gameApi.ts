// api/gameApi.js
import axios from "axios";
import { API_URL, API_GAMES_URL } from "@/constants";

export const gameApi = {
  async getAllGames(token) {
    return await axios.get(`${API_URL}${API_GAMES_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getGameById(gameId, token) {
    return await axios.get(`${API_URL}${API_GAMES_URL}/${gameId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createGame(token, data) {
    console.log(data);
    return await axios.post(`${API_URL}${API_GAMES_URL}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateGame(token, gameId, data) {
    return await axios.patch(`${API_URL}${API_GAMES_URL}/${gameId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async deleteGame(token, gameId) {
    return await axios.delete(`${API_URL}${API_GAMES_URL}/${gameId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
