import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import CreateStudent from '../components/CreateStudent';
import StudentsList from '../components/StudentsList';
import StudentSearch from '../components/StudentSearch';

const Students: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleStudentCreated = () => {
    // Force refresh of the students list
    setRefreshKey(prev => prev + 1);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const goToSections = () => {
    navigate('/sections');
  };

  const goToCapacity = () => {
    navigate('/capacity');
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
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Alumnos</h1>
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

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Navigation Buttons */}
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={goToDashboard}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              ← Panel de Control
            </button>
            <button
              onClick={goToSections}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Gestionar Secciones
            </button>
            <button
              onClick={goToCapacity}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              � Ver Capacidad
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Student Search - Takes full width */}
            <div className="xl:col-span-3">
              <StudentSearch />
            </div>
            
            {/* Create Student Form - Takes 1 column on xl screens */}
            <div className="xl:col-span-1">
              <CreateStudent 
                onStudentCreated={handleStudentCreated} 
              />
            </div>
            
            {/* Students List - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <StudentsList key={refreshKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
