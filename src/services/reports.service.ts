import api from '../config/axios';

export interface ReportSection {
  id: number;
  name: string;
}

const reportsService = {
  getSectionsByGrade: async (gradeId: number): Promise<ReportSection[]> => {
    const response = await api.get(`/reports/sections/${gradeId}`);
    return response.data;
  }
};

export default reportsService;
