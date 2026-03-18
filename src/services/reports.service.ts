import axios from 'axios';

const API_URL = 'https://inscripciones-backend-z2po.onrender.com/reports';

export interface ReportSection {
  id: number;
  name: string;
}

const reportsService = {
  getSectionsByGrade: async (gradeId: number): Promise<ReportSection[]> => {
    const token = localStorage.getItem('token') || '';
    const response = await axios.get(`${API_URL}/sections/${gradeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};

export default reportsService;
