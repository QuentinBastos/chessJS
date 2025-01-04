import { reactive } from 'vue';
import { authApi } from '@/composable/auth/authApi';

export function useAuthService() {
  const state = reactive({
    token: null as string | null,
    user: null as any,
    loading: false,
    error: null as any,
  });

  const authenticate = async (username: string, password: string) => {
    state.loading = true;
    try {
      const response = await authApi.authenticate(username, password);
      state.token = response.data.token;
      localStorage.setItem('jwt_token', state.token);
      return response.data;
    } catch (err) {
      state.error = err;
      console.error('Error authenticating:', err);
    } finally {
      state.loading = false;
    }
  };

  const logout = () => {
    state.token = null;
    localStorage.removeItem('jwt_token');
  };

  return {
    state,
    authenticate,
    logout
  };
}
