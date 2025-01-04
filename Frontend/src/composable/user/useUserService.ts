import { reactive } from 'vue';
import { userApi } from '@/composable/user/userApi';

export function useUserService() {
  const state = reactive({
    users: [] as never[],
    user: null as never | null,
    loading: false,
    error: null as never,
  });

  const fetchAllUsers = async (token: string) => {
    state.loading = true;
    try {
      const response = await userApi.getAllUsers(token);
      state.users = response.data;
      return response.data;
    } catch (err) {
      state.error = err;
      console.error('Error fetching all users:', err);
    } finally {
      state.loading = false;
    }
  };

  const fetchUserById = async (userId: number, token: string) => {
    state.loading = true;
    try {
      const response = await userApi.getUserById(userId, token);
      state.user = response.data;
    } catch (err) {
      state.error = err;
      console.error('Error fetching user by ID:', err);
    } finally {
      state.loading = false;
    }
  };

  const createUser = async (
    data: { username: string; email: string; password: string; rank: number }
  ) => {
    state.loading = true;
    try {
      await userApi.createUser(data);
    } catch (err) {
      state.error = err;
      console.error('Error creating user:', err);
    } finally {
      state.loading = false;
    }
  };

  const deleteUser = async (token: string, userId: number) => {
    state.loading = true;
    try {
      await userApi.deleteUser(token, userId);
      await fetchAllUsers(token);
    } catch (err) {
      state.error = err;
      console.error('Error deleting user:', err);
    } finally {
      state.loading = false;
    }
  };

  const updateUser = async (
    token: string,
    userId: number,
    data: { username?: string; email?: string; password?: string; rank?: number }
  ) => {
    state.loading = true;
    try {
      await userApi.updateUser(token, userId, data);
      await fetchUserById(userId, token);
    } catch (err) {
      state.error = err;
      console.error('Error updating user:', err);
    } finally {
      state.loading = false;
    }
  };

  return {
    state,
    fetchAllUsers,
    fetchUserById,
    createUser,
    deleteUser,
    updateUser,
  };
}
