import axios from 'axios';
import { API_URL } from '@/constants';

export const authApi = {
  async authenticate(username: string, password: string) {
    return await axios.post(`${API_URL}/auth`, {
      grant_type: "password",
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
