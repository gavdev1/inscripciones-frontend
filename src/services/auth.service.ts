import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

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
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<any> => {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  },

  getProfile: async (token: string): Promise<any> => {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  recoverPassword: async (data: RecoveryData): Promise<any> => {
    const response = await axios.post(`${API_URL}/get-token-password`, data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<any> => {
    const response = await axios.post(`${API_URL}/reset-password`, data);
    return response.data;
  }
};

export default authService;
