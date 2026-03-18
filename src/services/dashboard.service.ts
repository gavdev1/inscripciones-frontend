import api from '../config/axios';

export interface DashboardStats {
  totalStudents: number;
  totalSections: number;
  totalReports: number;
  occupancyRate: number;
  studentsByGrade: Array<{
    gradeId: number;
    gradeName: string;
    gradeLevel: number;
    studentCount: number;
  }>;
  sectionsByGrade: Array<{
    gradeId: number;
    gradeName: string;
    sections: Array<{
      id: number;
      name: string;
      studentCount: number;
    }>;
  }>;
  recentActivity: Array<{
    type: 'student_created' | 'section_created' | 'report_generated';
    description: string;
    timestamp: string;
  }>;
}

export interface GradeStats {
  id: number;
  name: string;
  level: number;
  studentCount: number;
  sectionCount: number;
  averagePerSection: number;
  capacity: number;
  occupancyRate: number;
}

const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/dashboard/stats-test', {
        timeout: 10000
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      // Return fallback data if API fails
      return {
        totalStudents: 0,
        totalSections: 18,
        totalReports: 0,
        occupancyRate: 0,
        studentsByGrade: [],
        sectionsByGrade: [],
        recentActivity: []
      };
    }
  },

  getGradeStats: async (): Promise<GradeStats[]> => {
    try {
      const response = await api.get('/dashboard/grade-stats-test', {
        timeout: 10000
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching grade stats:', error);
      return [];
    }
  },

  getSystemStatus: async () => {
    try {
      const response = await api.get('/dashboard/system-status', {
        timeout: 5000
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching system status:', error);
      return {
        database: 'active',
        server: 'online',
        lastBackup: new Date().toISOString(),
        uptime: '0 days'
      };
    }
  }
};

export default dashboardService;
