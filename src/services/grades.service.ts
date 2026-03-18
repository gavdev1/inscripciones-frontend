import axios from 'axios';

const API_URL = 'https://inscripciones-backend-z2po.onrender.com/grades';

export interface Grade {
  id?: number;
  name: string;
  level: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateGradeData {
  name: string;
  level: number;
}

export interface UpdateGradeData {
  name: string;
  level: number;
}

const gradesService = {
  getAll: async (token: string): Promise<Grade[]> => {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  getById: async (id: number, token: string): Promise<Grade> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  create: async (data: CreateGradeData, token: string): Promise<Grade> => {
    const response = await axios.post(`${API_URL}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  update: async (id: number, data: UpdateGradeData, token: string): Promise<any> => {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  delete: async (id: number, token: string): Promise<any> => {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  initialize: async (token: string): Promise<any> => {
    const response = await axios.post(`${API_URL}/initialize`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};

export default gradesService;
export const getGrades = async (): Promise<Grade[]> => {
  const token = localStorage.getItem('token') || '';
  return gradesService.getAll(token);
};
