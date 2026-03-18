import api from '../config/axios';

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
    const url = gradeId ? `/sections?gradeId=${gradeId}` : '/sections';
    const response = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  getById: async (id: number, token: string): Promise<Section> => {
    const response = await api.get(`/sections/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  create: async (data: CreateSectionData, token: string): Promise<Section> => {
    const response = await api.post('/sections', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  update: async (id: number, data: UpdateSectionData): Promise<any> => {
    const response = await api.put(`/sections/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<any> => {
    const response = await api.delete(`/sections/${id}`);
    return response.data;
  }
};

export default sectionsService;
export const getSections = async (): Promise<Section[]> => {
  const token = localStorage.getItem('token') || '';
  return sectionsService.getAll(token);
};
