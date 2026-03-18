import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import dashboardService from '../services/dashboard.service';
import { 
  Users, 
  Layers, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Download
} from 'lucide-react';

interface GradeCapacity {
  id: number;
  name: string;
  level: number;
  studentCount: number;
  sectionCount: number;
  averagePerSection: number;
  capacity: number;
  occupancyRate: number;
  sections: Array<{
    id: number;
    name: string;
    studentCount: number;
    capacity: number;
    occupancyRate: number;
  }>;
}

const Capacity: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [gradeStats, setGradeStats] = useState<GradeCapacity[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState<'all' | 'primary' | 'secondary'>('all');

  useEffect(() => {
    const fetchCapacityData = async () => {
      if (!token) return;
      
      try {
        setIsLoading(true);
        
        // Fetch grade stats
        const gradeStatsData = await dashboardService.getGradeStats(token);
        
        // Fetch dashboard stats to get sections by grade
        const dashboardStats = await dashboardService.getDashboardStats(token);
        
        // Combine data
        const combinedData = gradeStatsData.map(grade => {
          const sectionsByGrade = dashboardStats.sectionsByGrade.find(
            (sg: any) => sg.gradeId === grade.id
          );
          
          return {
            ...grade,
            sections: sectionsByGrade?.sections.map((section: any) => ({
              ...section,
              capacity: 30, // 30 students per section
              occupancyRate: Math.round((section.studentCount / 30) * 100)
            })) || []
          };
        });
        
        setGradeStats(combinedData);
      } catch (error) {
        console.error('Error fetching capacity data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCapacityData();
  }, [token]);

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'text-red-600 bg-red-100';
    if (rate >= 75) return 'text-yellow-600 bg-yellow-100';
    if (rate >= 50) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const getOccupancyIcon = (rate: number) => {
    if (rate >= 90) return AlertTriangle;
    if (rate >= 75) return TrendingUp;
    return CheckCircle;
  };

  const filteredGrades = gradeStats.filter(grade => {
    if (filterLevel === 'all') return true;
    if (filterLevel === 'primary') return grade.level <= 3;
    if (filterLevel === 'secondary') return grade.level > 3;
    return true;
  });

  const totalCapacity = gradeStats.reduce((sum, grade) => sum + grade.capacity, 0);
  const totalStudents = gradeStats.reduce((sum, grade) => sum + grade.studentCount, 0);
  const overallOccupancyRate = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;

  const exportToCSV = () => {
    const csvContent = [
      ['Grado', 'Nivel', 'Alumnos', 'Secciones', 'Capacidad', 'Tasa Ocupación'],
      ...filteredGrades.map(grade => [
        grade.name,
        grade.level.toString(),
        grade.studentCount.toString(),
        grade.sectionCount.toString(),
        grade.capacity.toString(),
        `${grade.occupancyRate}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capacity-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Capacidad del Sistema</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </button>
                <span className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0)}{user?.lastname?.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">{totalStudents}</span>
              </div>
              <p className="text-sm text-gray-600">Total de Alumnos</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Layers className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">{gradeStats.reduce((sum, grade) => sum + grade.sectionCount, 0)}</span>
              </div>
              <p className="text-sm text-gray-600">Total de Secciones</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">{totalCapacity}</span>
              </div>
              <p className="text-sm text-gray-600">Capacidad Total</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <PieChart className="h-8 w-8 text-orange-600" />
                <span className="text-2xl font-bold text-gray-900">{overallOccupancyRate}%</span>
              </div>
              <p className="text-sm text-gray-600">Ocupación General</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtrar por nivel:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilterLevel('all')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      filterLevel === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilterLevel('primary')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      filterLevel === 'primary' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Primaria (1-3)
                  </button>
                  <button
                    onClick={() => setFilterLevel('secondary')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      filterLevel === 'secondary' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Secundaria (4-6)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Grades Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredGrades.map((grade) => {
                const OccupancyIcon = getOccupancyIcon(grade.occupancyRate);
                const occupancyColor = getOccupancyColor(grade.occupancyRate);
                
                return (
                  <div key={grade.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Grade Header */}
                    <div className={`p-6 border-b border-gray-200 ${
                      selectedGrade === grade.id ? 'bg-blue-50' : ''
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{grade.name}</h3>
                          <p className="text-sm text-gray-600">Nivel {grade.level}</p>
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${occupancyColor}`}>
                          <OccupancyIcon className="h-4 w-4 mr-1" />
                          {grade.occupancyRate}% ocupado
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>{grade.studentCount} / {grade.capacity} alumnos</span>
                          <span>{grade.occupancyRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              grade.occupancyRate >= 90 ? 'bg-red-500' :
                              grade.occupancyRate >= 75 ? 'bg-yellow-500' :
                              grade.occupancyRate >= 50 ? 'bg-blue-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${grade.occupancyRate}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{grade.studentCount}</p>
                          <p className="text-xs text-gray-600">Alumnos</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{grade.sectionCount}</p>
                          <p className="text-xs text-gray-600">Secciones</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{grade.averagePerSection}</p>
                          <p className="text-xs text-gray-600">Promedio</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Sections Details */}
                    <div className="p-6">
                      <button
                        onClick={() => setSelectedGrade(selectedGrade === grade.id ? null : grade.id)}
                        className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors mb-4"
                      >
                        <span>Detalles por Sección</span>
                        <svg 
                          className={`h-4 w-4 transition-transform ${
                            selectedGrade === grade.id ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {selectedGrade === grade.id && (
                        <div className="space-y-3">
                          {grade.sections.map((section) => {
                            const SectionOccupancyIcon = getOccupancyIcon(section.occupancyRate);
                            const sectionOccupancyColor = getOccupancyColor(section.occupancyRate);
                            
                            return (
                              <div key={section.id} className="border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-900">Sección {section.name}</span>
                                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${sectionOccupancyColor}`}>
                                    <SectionOccupancyIcon className="h-3 w-3 mr-1" />
                                    {section.occupancyRate}%
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                      section.occupancyRate >= 90 ? 'bg-red-500' :
                                      section.occupancyRate >= 75 ? 'bg-yellow-500' :
                                      section.occupancyRate >= 50 ? 'bg-blue-500' :
                                      'bg-green-500'
                                    }`}
                                    style={{ width: `${section.occupancyRate}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  {section.studentCount} / {section.capacity} alumnos
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Capacity;
