import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import CreateSection from '../components/CreateSection';
import SectionsList from '../components/SectionsList';
import { Layers, Users, Home, BarChart3 } from 'lucide-react';

const Sections: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSectionCreated = () => {
    // Force refresh of the sections list
    setRefreshKey(prev => prev + 1);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const goToStudents = () => {
    navigate('/students');
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
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Secciones</h1>
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
              onClick={goToStudents}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              <Users className="h-4 w-4 mr-2 inline" />
              Gestionar Alumnos
            </button>
            <button
              onClick={goToCapacity}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              <BarChart3 className="h-4 w-4 mr-2 inline" />
              Ver Capacidad
            </button>
          </div>

          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-4">Gestión de Secciones</h2>
                <p className="text-purple-100 text-lg">
                  Organiza las secciones por grado para una mejor gestión del sistema.
                  Cada sección pertenece específicamente a un grado educativo.
                </p>
                <div className="mt-6 flex items-center space-x-6">
                  <div className="flex items-center">
                    <Layers className="h-6 w-6 mr-2" />
                    <span className="text-sm">Secciones por Grado</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-6 w-6 mr-2" />
                    <span className="text-sm">Asignación Específica</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <Layers className="h-24 w-24 text-white/20" />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Section Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Crear Nueva Sección</h3>
                  <p className="text-sm text-gray-600">
                    Asigna una sección a un grado específico. Cada sección solo puede pertenecer a un grado.
                  </p>
                </div>
                <CreateSection onSectionCreated={handleSectionCreated} />
              </div>
            </div>
            
            {/* Sections List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Secciones Existentes</h3>
                  <p className="text-sm text-gray-600">
                    Lista de todas las secciones organizadas por grado con su información de ocupación.
                  </p>
                </div>
                <SectionsList key={refreshKey} />
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Layers className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Por Grado Específico</h4>
                  <p className="text-sm text-gray-600">Asignación clara</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Cada sección está vinculada a un grado específico (Primero, Segundo, etc.)
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Gestión Organizada</h4>
                  <p className="text-sm text-gray-600">Control total</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Mantén un control claro de qué secciones pertenecen a cada grado educativo.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Capacidad Controlada</h4>
                  <p className="text-sm text-gray-600">Monitoreo constante</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Visualiza la capacidad y ocupación de cada sección por grado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sections;
