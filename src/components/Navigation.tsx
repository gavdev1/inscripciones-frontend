import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Users, 
  Layers, 
  FileText, 
  LogOut, 
  Menu,
  X,
  School,
  BarChart3,
  PieChart
} from 'lucide-react';

interface NavigationProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Panel de Control', 
      icon: Home,
      description: 'Vista general del sistema'
    },
    { 
      path: '/students', 
      label: 'Alumnos', 
      icon: Users,
      description: 'Gestionar alumnos'
    },
    { 
      path: '/sections', 
      label: 'Secciones', 
      icon: Layers,
      description: 'Gestionar secciones'
    },
    { 
      path: '/capacity', 
      label: 'Capacidad', 
      icon: PieChart,
      description: 'Ver capacidad y ocupación'
    },
    { 
      path: '/reports', 
      label: 'Reportes', 
      icon: FileText,
      description: 'Generar reportes PDF'
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="flex flex-col h-full">
          {/* Logo and User Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <School className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Sistema de Inscripciones</h1>
                <p className="text-xs text-gray-500">Gestión Escolar</p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name} {user?.lastname}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                    {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Navegación Principal
            </h3>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                  {isActive(item.path) && (
                    <div className="h-2 w-2 bg-blue-700 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-sm font-semibold text-gray-900">Resumen Rápido</h3>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <p>• Sistema activo y funcionando</p>
                <p>• {user?.role === 'admin' ? 'Acceso completo' : 'Acceso limitado'}</p>
                <p>• Última actualización: hoy</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
