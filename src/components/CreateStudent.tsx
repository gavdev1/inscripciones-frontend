import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import studentsService, { type CreateStudentData, type CapacityInfo } from '../services/students.service';
import gradesService, { type Grade } from '../services/grades.service';
import sectionsService, { type Section } from '../services/sections.service';

interface CreateStudentProps {
  onStudentCreated?: () => void;
  onCapacityUpdated?: () => void;
}

const CreateStudent: React.FC<CreateStudentProps> = ({ onStudentCreated, onCapacityUpdated }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState<CreateStudentData>({
    name: '',
    lastname: '',
    birth_date: '',
    gender: 'M',
    grade_id: 0,
    section_id: 0
  });
  const [grades, setGrades] = useState<Grade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [capacityData, setCapacityData] = useState<CapacityInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gradesData, sectionsData, capacityInfo] = await Promise.all([
          gradesService.getAll(token!),
          sectionsService.getAll(token!),
          studentsService.getCapacity(token!)
        ]);
        setGrades(gradesData);
        setSections(sectionsData);
        setCapacityData(capacityInfo);
        
        // Set default values if available
        if (gradesData.length > 0) {
          setFormData(prev => ({ ...prev, grade_id: gradesData[0].id! }));
        }
        if (sectionsData.length > 0) {
          setFormData(prev => ({ ...prev, section_id: sectionsData[0].id! }));
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError('Error al cargar los datos necesarios');
      } finally {
        setIsLoadingData(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade_id' || name === 'section_id' ? parseInt(value) : value
    }));
  };

  const getCapacityForSection = (gradeId: number, sectionId: number) => {
    return capacityData.find(
      item => item.grade_id === gradeId && item.section_id === sectionId
    );
  };

  const isSectionFull = (gradeId: number, sectionId: number) => {
    const capacity = getCapacityForSection(gradeId, sectionId);
    return capacity?.is_full || false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form data being submitted:', formData);
    
    if (!formData.name.trim() || !formData.lastname.trim()) {
      setError('El nombre y apellido son requeridos');
      return;
    }

    if (!formData.birth_date) {
      setError('La fecha de nacimiento es requerida');
      return;
    }

    if (formData.grade_id === 0 || formData.section_id === 0) {
      setError('Debe seleccionar un grado y una sección');
      return;
    }

    if (isSectionFull(formData.grade_id, formData.section_id)) {
      const capacity = getCapacityForSection(formData.grade_id, formData.section_id);
      setError(`La sección ${capacity?.section_name?.toUpperCase()} del ${capacity?.grade_name} ya está llena (30 alumnos).`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Sending student creation request...');
      await studentsService.create(formData, token!);
      console.log('Student created successfully');
      setSuccess('Alumno creado exitosamente');
      setFormData({
        name: '',
        lastname: '',
        birth_date: '',
        gender: 'M',
        grade_id: grades.length > 0 ? grades[0].id! : 0,
        section_id: sections.length > 0 ? sections[0].id! : 0
      });
      
      // Refresh capacity data to show updated counts
      const updatedCapacity = await studentsService.getCapacity(token!);
      setCapacityData(updatedCapacity);
      
      if (onStudentCreated) {
        onStudentCreated();
      }
      if (onCapacityUpdated) {
        onCapacityUpdated();
      }
    } catch (error: any) {
      console.error('Error creating student:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        setError(error.response.data.errors.map((err: any) => err.msg || err.message).join(', '));
      } else {
        setError(error.message || 'Error al crear el alumno');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">Cargando datos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Crear Nuevo Alumno</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Juan"
              required
            />
          </div>

          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Pérez"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Género
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="grade_id" className="block text-sm font-medium text-gray-700 mb-1">
              Grado
            </label>
            <select
              id="grade_id"
              name="grade_id"
              value={formData.grade_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value={0}>Seleccione un grado</option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="section_id" className="block text-sm font-medium text-gray-700 mb-1">
              Sección
            </label>
            <select
              id="section_id"
              name="section_id"
              value={formData.section_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value={0}>Seleccione una sección</option>
              {sections.map((section) => {
                const capacity = getCapacityForSection(formData.grade_id, section.id!);
                const isFull = isSectionFull(formData.grade_id, section.id!);
                const available = capacity?.available_spots || 0;
                
                return (
                  <option 
                    key={section.id} 
                    value={section.id}
                    disabled={isFull && formData.grade_id !== 0}
                    className={isFull && formData.grade_id !== 0 ? 'text-red-500' : ''}
                  >
                    Sección {section.name.toUpperCase()} 
                    {formData.grade_id !== 0 && (
                      ` - ${available} cupos disponibles${isFull ? ' (LLeno)' : ''}`
                    )}
                  </option>
                );
              })}
            </select>
            {formData.grade_id !== 0 && (
              <div className="mt-1 text-xs text-gray-500">
                Máximo 30 alumnos por sección
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          {isLoading ? 'Creando...' : 'Crear Alumno'}
        </button>
      </form>
    </div>
  );
};

export default CreateStudent;
