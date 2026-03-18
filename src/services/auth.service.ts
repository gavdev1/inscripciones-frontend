import api from '../config/axios';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  lastname: string;
  email: string;
  password: string;
}

export interface RecoveryData {
  email: string;
  code?: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: number;
    name: string;
    lastname: string;
    email: string;
    role: string;
  };
}

const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (token: string): Promise<any> => {
    const response = await api.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  recoverPassword: async (email: string): Promise<void> => {
    await api.post('/auth/recover-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, newPassword });
  },

  verifyToken: async (token: string): Promise<{ valid: boolean }> => {
    const response = await api.post('/auth/verify-token', { token });
    return response.data;
  }
};

export default authService;
