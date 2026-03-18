import api from '../config/axios';

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
    const response = await api.get('/grades', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  getById: async (id: number, token: string): Promise<Grade> => {
    const response = await api.get(`/grades/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  create: async (data: CreateGradeData, token: string): Promise<Grade> => {
    const response = await api.post('/grades', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  update: async (id: number, data: UpdateGradeData): Promise<any> => {
    const response = await api.put(`/grades/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<any> => {
    const response = await api.delete(`/grades/${id}`);
    return response.data;
  },

  initialize: async (): Promise<any> => {
    const response = await api.post('/grades/initialize', {});
    return response.data;
  }
};

export default gradesService;
export const getGrades = async (): Promise<Grade[]> => {
  const token = localStorage.getItem('token') || '';
  return gradesService.getAll(token);
};
