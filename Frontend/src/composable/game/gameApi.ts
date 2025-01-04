
import axios from "axios";
import { API_URL, API_GAMES_URL } from "@/constants";

export const gameApi = {
  async getAllGames(token : string) {
    return await axios.get(`${API_URL}${API_GAMES_URL}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getGameById(gameId : number, token : string) {
    return await axios.get(`${API_URL}${API_GAMES_URL}/${gameId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async createGame(token : string,  data: { name: string; review: string; share: number } ) {
    console.log(data);
    return await axios.post(`${API_URL}${API_GAMES_URL}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateGame(token : string, gameId : number,  data: { name: string; review: string; share: number }) {
    return await axios.patch(`${API_URL}${API_GAMES_URL}/${gameId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async deleteGame(token : string, gameId : number) {
    return await axios.delete(`${API_URL}${API_GAMES_URL}/${gameId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
