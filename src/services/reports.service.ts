import axios from 'axios';

const API_URL = 'http://localhost:3000/reports';

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
