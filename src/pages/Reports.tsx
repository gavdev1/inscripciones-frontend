import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { FileText, Download, Filter, X, Users, Layers, BarChart3 } from 'lucide-react';
import { getGrades, type Grade } from '../services/grades.service';
import reportsService, { type ReportSection } from '../services/reports.service';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [sections, setSections] = useState<ReportSection[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSections, setSelectedSections] = useState<number[]>([]);
  const [selectAllSections, setSelectAllSections] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadGrades();
  }, []);

  useEffect(() => {
    if (selectedGrade) {
      loadSections(selectedGrade);
    } else {
      setSections([]);
      setSelectedSections([]);
      setSelectAllSections(false);
    }
  }, [selectedGrade]);

  const loadGrades = async () => {
    try {
      const data = await getGrades();
      setGrades(data);
    } catch (err) {
      setError('Error al cargar los grados');
    }
  };

  const loadSections = async (gradeId: number) => {
    try {
      const data = await reportsService.getSectionsByGrade(gradeId);
      setSections(data);
    } catch (err) {
      setError('Error al cargar las secciones');
    }
  };

  const handleSectionToggle = (sectionId: number) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSelectAllSections = () => {
    if (selectAllSections) {
      setSelectedSections([]);
      setSelectAllSections(false);
    } else {
      setSelectedSections(sections.map(s => s.id));
      setSelectAllSections(true);
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const goToStudents = () => {
    navigate('/students');
  };

  const goToSections = () => {
    navigate('/sections');
  };

  const goToCapacity = () => {
    navigate('/capacity');
  };

  const generateReport = async () => {
    if (!selectedGrade) {
      setError('Por favor, seleccione un grado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        gradeId: selectedGrade.toString(),
        ...(selectedSections.length > 0 && !selectAllSections && { 
          sectionIds: selectedSections.join(',') 
        })
      });

      const response = await fetch(`http://localhost:3000/reports/enrollment?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al generar el reporte');
      }

      // Descargar el PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte-inscripcion.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      setError('Error al generar el reporte. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Generación de Reportes</h1>
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
              onClick={goToSections}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              <Layers className="h-4 w-4 mr-2 inline" />
              Gestionar Secciones
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
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-4">Reportes de Inscripción</h2>
                <p className="text-blue-100 text-lg">
                  Genera reportes PDF detallados de alumnos inscritos por grado y secciones.
                  Personaliza los filtros para obtener la información exacta que necesitas.
                </p>
                <div className="mt-6 flex items-center space-x-6">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 mr-2" />
                    <span className="text-sm">Reportes PDF</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-6 w-6 mr-2" />
                    <span className="text-sm">Descarga Automática</span>
                  </div>
                  <div className="flex items-center">
                    <Filter className="h-6 w-6 mr-2" />
                    <span className="text-sm">Filtros Avanzados</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <FileText className="h-24 w-24 text-white/20" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Generar Reporte de Alumnos Inscriptos
                </h3>
                <p className="text-gray-600">
                  Seleccione un grado y opcionalmente las secciones específicas para generar un reporte personalizado.
                </p>
              </div>

              {/* Selección de Grado */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Grado *
                </label>
                <div className="relative">
                  <select
                    value={selectedGrade || ''}
                    onChange={(e) => setSelectedGrade(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="">-- Seleccione un grado --</option>
                    {grades.map(grade => (
                      <option key={grade.id!} value={grade.id!}>
                        {grade.name} (Nivel {grade.level})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Filtros de Secciones */}
              {selectedGrade && (
                <div className="mb-8">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-between w-full px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <div className="flex items-center">
                      <Filter className="h-5 w-5 mr-2 text-gray-600" />
                      <span className="font-medium text-gray-700">
                        {selectAllSections 
                          ? 'Todas las secciones seleccionadas' 
                          : selectedSections.length > 0 
                            ? `${selectedSections.length} sección(es) seleccionada(s)`
                            : 'Seleccionar secciones'
                        }
                      </span>
                    </div>
                    <div className="flex items-center">
                      {selectedSections.length > 0 && !selectAllSections && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSections([]);
                          }}
                          className="mr-2 p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      <span className="text-gray-500">
                        {showFilters ? '▲' : '▼'}
                      </span>
                    </div>
                  </button>

                  {showFilters && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-700">Seleccionar Secciones</h4>
                        <button
                          onClick={handleSelectAllSections}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {selectAllSections ? 'Deseleccionar todo' : 'Seleccionar todo'}
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {sections.map(section => (
                          <label
                            key={section.id}
                            className="flex items-center p-2 bg-white rounded border border-gray-200 cursor-pointer hover:bg-blue-50"
                          >
                            <input
                              type="checkbox"
                              checked={selectAllSections || selectedSections.includes(section.id)}
                              onChange={() => handleSectionToggle(section.id)}
                              disabled={selectAllSections}
                              className="mr-2 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{section.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Botón de generación */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={generateReport}
                  disabled={loading || !selectedGrade}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generando reporte...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-3" />
                      Generar Reporte PDF
                    </>
                  )}
                </button>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {/* Información adicional */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Guía de Uso del Generador de Reportes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Pasos Básicos:</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Seleccione un grado (obligatorio)</li>
                      <li>• Elija secciones específicas o todas</li>
                      <li>• Haga clic en "Generar Reporte PDF"</li>
                      <li>• El archivo se descargará automáticamente</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-blue-800 mb-2">Características:</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Estadísticas del grado seleccionado</li>
                      <li>• Detalles de alumnos por sección</li>
                      <li>• Formato PDF profesional</li>
                      <li>• Información actualizada al momento</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
