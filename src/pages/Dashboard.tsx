import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import dashboardService from '../services/dashboard.service';
import { 
  Users, 
  Layers, 
  FileText, 
  TrendingUp, 
  Calendar,
  Award,
  BookOpen,
  Target,
  Database,
  Server
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSections: 0,
    totalReports: 0,
    occupancyRate: 0,
    studentsByGrade: [] as Array<{
      gradeId: number;
      gradeName: string;
      gradeLevel: number;
      studentCount: number;
    }>,
    sectionsByGrade: [] as Array<{
      gradeId: number;
      gradeName: string;
      sections: Array<{
        id: number;
        name: string;
        studentCount: number;
      }>;
    }>,
    recentActivity: [] as Array<{
      type: string;
      description: string;
      timestamp: string;
    }>
  });
  const [gradeStats, setGradeStats] = useState<Array<{
    id: number;
    name: string;
    level: number;
    studentCount: number;
    sectionCount: number;
    averagePerSection: number;
    capacity: number;
    occupancyRate: number;
  }>>([]);
  const [systemStatus, setSystemStatus] = useState({
    database: 'active',
    server: 'online',
    lastBackup: new Date().toISOString(),
    uptime: '0 days'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      
      try {
        setIsLoading(true);
        setConnectionError(false);
        
        // Fetch all dashboard data in parallel
        const [dashboardStats, gradeStatsData, systemStatusData] = await Promise.all([
          dashboardService.getDashboardStats(token),
          dashboardService.getGradeStats(token),
          dashboardService.getSystemStatus(token)
        ]);
        
        setStats(dashboardStats);
        setGradeStats(gradeStatsData);
        setSystemStatus(systemStatusData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setConnectionError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const goToStudents = () => {
    navigate('/students');
  };

  const goToSections = () => {
    navigate('/sections');
  };

  const goToReports = () => {
    navigate('/reports');
  };

  const dashboardStats = [
    {
      title: "Total de Alumnos",
      value: stats.totalStudents.toString(),
      change: stats.totalStudents > 0 ? "Activo" : "Sin datos",
      changeType: stats.totalStudents > 0 ? "positive" : "neutral",
      icon: Users,
      color: "blue"
    },
    {
      title: "Secciones Activas",
      value: stats.totalSections.toString(),
      change: "Estable",
      changeType: "neutral",
      icon: Layers,
      color: "green"
    },
    {
      title: "Reportes Generados",
      value: stats.totalReports.toString(),
      change: stats.totalReports > 0 ? "Activo" : "Sin datos",
      changeType: stats.totalReports > 0 ? "positive" : "neutral",
      icon: FileText,
      color: "purple"
    },
    {
      title: "Tasa de Ocupación",
      value: `${stats.occupancyRate}%`,
      change: stats.occupancyRate > 50 ? "Buena" : "Baja",
      changeType: stats.occupancyRate > 50 ? "positive" : "neutral",
      icon: TrendingUp,
      color: "orange"
    }
  ];

  const quickActions = [
    {
      title: "Gestionar Alumnos",
      description: "Agregar, editar o eliminar alumnos",
      icon: Users,
      color: "blue",
      action: goToStudents
    },
    {
      title: "Gestionar Secciones",
      description: "Administrar secciones por grado",
      icon: Layers,
      color: "green",
      action: goToSections
    },
    {
      title: "Generar Reportes",
      description: "Crear reportes PDF de inscripción",
      icon: FileText,
      color: "purple",
      action: goToReports
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  const getLightColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
                <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
              </div>
              <div className="flex items-center space-x-4">
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

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Connection Error Alert */}
          {connectionError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-red-800 font-medium">Error de Conexión</h4>
                <p className="text-red-700 text-sm">
                  No se pudieron cargar las estadísticas. Verifique que el backend esté corriendo en http://localhost:3000
                </p>
              </div>
            </div>
          )}

          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    ¡Bienvenido, {user?.name}! 👋
                  </h2>
                  <p className="text-blue-100 mb-4">
                    {user?.role === 'admin' 
                      ? 'Tienes acceso completo al sistema de inscripciones.'
                      : 'Gestiona las inscripciones y genera reportes fácilmente.'
                    }
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                      <Award className="h-3 w-3 mr-1" />
                      {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <BookOpen className="h-24 w-24 text-white/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="animate-pulse">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              dashboardStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`h-12 w-12 rounded-lg ${getColorClasses(stat.color)} bg-opacity-10 flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 ${getColorClasses(stat.color).replace('bg-', 'text-')}`} />
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        stat.changeType === 'positive' ? 'bg-green-100 text-green-800' :
                        stat.changeType === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left group"
                  >
                    <div className={`h-12 w-12 rounded-lg ${getColorClasses(action.color)} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${getColorClasses(action.color).replace('bg-', 'text-')}`} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Students by Grade */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Alumnos por Grado</h3>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : stats.studentsByGrade.length > 0 ? (
                  stats.studentsByGrade.map((grade: any) => (
                    <div key={grade.gradeId} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{grade.gradeName}</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {grade.studentCount} alumnos
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No hay datos disponibles</p>
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Estado del Sistema</h3>
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base de datos</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    systemStatus.database === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {systemStatus.database === 'active' ? 'Activa' : 'Error'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Servidor</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    systemStatus.server === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {systemStatus.server === 'online' ? 'En línea' : 'Desconectado'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tiempo activo</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {systemStatus.uptime}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Último respaldo</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {new Date(systemStatus.lastBackup).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Consejos Útiles</h3>
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">
                    Usa el sistema de reportes para generar PDFs de inscripción por grado.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">
                    Las secciones están organizadas por grado para mejor gestión.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">
                    {user?.role === 'admin' 
                      ? 'Como administrador, puedes eliminar todos los alumnos si es necesario.'
                      : 'Contacta al administrador para acciones especiales.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-gray-200 rounded-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.type === 'student_created' ? 'bg-green-500' :
                        activity.type === 'section_created' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No hay actividad reciente</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
