import axios from 'axios';

const API_URL = 'http://localhost:3000/sections';

export interface Section {
  id?: number;
  name: string;
  grade_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSectionData {
  name: string;
  grade_id: number;
}

export interface UpdateSectionData {
  name: string;
}

const sectionsService = {
  getAll: async (token: string, gradeId?: number): Promise<Section[]> => {
    const url = gradeId ? `${API_URL}?gradeId=${gradeId}` : API_URL;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  getById: async (id: number, token: string): Promise<Section> => {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  create: async (data: CreateSectionData, token: string): Promise<Section> => {
    const response = await axios.post(`${API_URL}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  update: async (id: number, data: UpdateSectionData, token: string): Promise<any> => {
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
  }
};

export default sectionsService;
export const getSections = async (): Promise<Section[]> => {
  const token = localStorage.getItem('token') || '';
  return sectionsService.getAll(token);
};
