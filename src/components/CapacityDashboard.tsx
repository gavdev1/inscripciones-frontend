import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import studentsService, { type CapacityInfo } from '../services/students.service';

const CapacityDashboard: React.FC = () => {
  const { token } = useAuth();
  const [capacityData, setCapacityData] = useState<CapacityInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCapacityData = async () => {
    try {
      setIsLoading(true);
      const data = await studentsService.getCapacity(token!);
      setCapacityData(data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching capacity data:', error);
      setError(error.response?.data?.message || 'Error al cargar información de capacidad');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCapacityData();
    }
  }, [token]);

  const getCapacityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return 'bg-red-500';
    if (percentage <= 10) return 'bg-orange-500';
    if (percentage <= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getCapacityText = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return 'Lleno';
    if (percentage <= 10) return 'Casi lleno';
    if (percentage <= 30) return 'Limitado';
    return 'Disponible';
  };

  const groupByGrade = (data: CapacityInfo[]) => {
    return data.reduce((acc, item) => {
      if (!acc[item.grade_level]) {
        acc[item.grade_level] = [];
      }
      acc[item.grade_level].push(item);
      return acc;
    }, {} as Record<number, CapacityInfo[]>);
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Cargando información de capacidad...</div>
        </div>
      </div>
    );
  }

  const groupedData = groupByGrade(capacityData);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Capacidad por Grado y Sección</h2>
        <div className="text-sm text-gray-500">
          Máximo 30 alumnos por sección
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {Object.keys(groupedData)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((gradeLevel) => {
            const gradeSections = groupedData[parseInt(gradeLevel)];
            const gradeName = gradeSections[0]?.grade_name || `Grado ${gradeLevel}`;
            
            return (
              <div key={gradeLevel} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{gradeName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gradeSections
                    .sort((a, b) => a.section_name.localeCompare(b.section_name))
                    .map((section) => (
                      <div key={`${section.grade_id}-${section.section_id}`} className="border border-gray-300 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">
                            Sección {section.section_name.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                            getCapacityColor(section.available_spots, section.max_capacity)
                          }`}>
                            {getCapacityText(section.available_spots, section.max_capacity)}
                          </span>
                        </div>
                        
                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Ocupación</span>
                            <span>{section.current_students}/{section.max_capacity}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getCapacityColor(section.available_spots, section.max_capacity)}`}
                              style={{ width: `${(section.current_students / section.max_capacity) * 100}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{section.available_spots}</span> cupos disponibles
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CapacityDashboard;
