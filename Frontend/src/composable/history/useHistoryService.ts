import { reactive } from 'vue';
import { historyApi } from '@/composable/history/historyApi';

export function useHistoryService() {
  const state = reactive({
    histories: [] as null[],
    history: null as null | null,
    loading: false,
    error: null as null,
  });

  const fetchAllHistories = async (token: string) => {
    state.loading = true;
    try {
      const response = await historyApi.getAllHistories(token);
      state.histories = response.data;
      return response.data;
    } catch (err) {
      state.error = err;
      console.error('Error fetching all histories:', err);
    } finally {
      state.loading = false;
    }
  };

  const fetchHistoryById = async (historyId: number, token: string) => {
    state.loading = true;
    try {
      const response = await historyApi.getHistoryById(historyId, token);
      state.history = response.data;
      return response.data;
    } catch (err) {
      state.error = err;
      console.error('Error fetching history by ID:', err);
    } finally {
      state.loading = false;
    }
  };

  const fetchHistoriesByUserId = async (userId: number, token: string) => {
    state.loading = true;
    try {
      const response = await historyApi.getHistoriesByUserId(userId, token);
      state.histories = response.data;
      return response.data;
    } catch (err) {
      state.error = err;
      console.error('Error fetching histories by user ID:', err);
    } finally {
      state.loading = false;
    }
  };

  const createHistory = async (
    token: string,
    data: { idUser: number; idGame: number }
  ) => {
    state.loading = true;
    try {
      await historyApi.createHistory(token, data);
      await fetchAllHistories(token);
    } catch (err) {
      state.error = err;
      console.error('Error creating history:', err);
    } finally {
      state.loading = false;
    }
  };

  const updateHistory = async (
    token: string,
    historyId: number,
    data: { idUser?: number; idGame?: number }
  ) => {
    state.loading = true;
    try {
      await historyApi.updateHistory(token, historyId, data);
      await fetchHistoryById(historyId, token);
    } catch (err) {
      state.error = err;
      console.error('Error updating history:', err);
    } finally {
      state.loading = false;
    }
  };

  const deleteHistory = async (token: string, historyId: number) => {
    state.loading = true;
    try {
      await historyApi.deleteHistory(token, historyId);
      await fetchAllHistories(token);
    } catch (err) {
      state.error = err;
      console.error('Error deleting history:', err);
    } finally {
      state.loading = false;
    }
  };

  return {
    state,
    fetchAllHistories,
    fetchHistoryById,
    fetchHistoriesByUserId,
    createHistory,
    updateHistory,
    deleteHistory,
  };
}
