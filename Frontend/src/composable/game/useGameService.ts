
import { reactive } from "vue";
import { gameApi } from "@/composable/game/gameApi";

export function useGameService() {
  const state = reactive({
    games: [],
    game: null,
    loading: false,
    error: null,
  });

  const fetchAllGames = async (token : string) => {
    state.loading = true;
    try {
      const response = await gameApi.getAllGames(token);
      state.games = response.data;
    } catch (err) {
      state.error = err;
      console.error("Error fetching all games:", err);
    } finally {
      state.loading = false;
    }
  };

  const fetchGameById = async (gameId : number, token : string) => {
    state.loading = true;
    try {
      const response = await gameApi.getGameById(gameId, token);
      state.game = response.data;
      return response.data;
    } catch (err) {
      state.error = err;
      console.error("Error fetching game by ID:", err);
    } finally {
      state.loading = false;
    }
  };

  const createGame = async (token: string, data: { name: string; review: string; share: number }) => {
    state.loading = true;
    try {
      const response = await gameApi.createGame(token, data);
      await fetchAllGames(token);
      return response;
    } catch (err) {
      state.error = err;
      console.error("Error creating game:", err);
      throw err;
    } finally {
      state.loading = false;
    }
  };


  const updateGame = async (token : string, gameId : number, data: { name: string; review: string; share: number }) => {
    state.loading = true;
    try {
      await gameApi.updateGame(token, gameId, data);
      await fetchGameById(gameId, token);
    } catch (err) {
      state.error = err;
      console.error("Error updating game:", err);
    } finally {
      state.loading = false;
    }
  };

  const deleteGame = async (token : string, gameId : number) => {
    state.loading = true;
    try {
      await gameApi.deleteGame(token, gameId);
      await fetchAllGames(token);
    } catch (err) {
      state.error = err;
      console.error("Error deleting game:", err);
    } finally {
      state.loading = false;
    }
  };

  return {
    state,
    fetchAllGames,
    fetchGameById,
    createGame,
    updateGame,
    deleteGame,
  };
}
