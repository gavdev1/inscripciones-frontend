import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import studentsService, { type Student, type UpdateStudentData } from '../services/students.service';
import gradesService, { type Grade } from '../services/grades.service';
import sectionsService, { type Section } from '../services/sections.service';

interface EditStudentProps {
  student: Student;
  onStudentUpdated?: () => void;
  onCancel?: () => void;
}

const EditStudent: React.FC<EditStudentProps> = ({ student, onStudentUpdated, onCancel }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState<UpdateStudentData>({
    name: student.name,
    lastname: student.lastname,
    birth_date: student.birth_date,
    gender: student.gender,
    grade_id: student.grade?.id || 0,
    section_id: student.section?.id || 0
  });
  const [grades, setGrades] = useState<Grade[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gradesData, sectionsData] = await Promise.all([
          gradesService.getAll(token!),
          sectionsService.getAll(token!)
        ]);
        setGrades(gradesData);
        setSections(sectionsData);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name!.trim() || !formData.lastname!.trim()) {
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

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await studentsService.update(student.id!, formData, token!);
      setSuccess('Alumno actualizado exitosamente');
      
      if (onStudentUpdated) {
        onStudentUpdated();
      }
      
      setTimeout(() => {
        if (onCancel) {
          onCancel();
        }
      }, 1500);
    } catch (error: any) {
      console.error('Error updating student:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        setError(error.response.data.errors.map((err: any) => err.msg || err.message).join(', '));
      } else {
        setError(error.message || 'Error al actualizar el alumno');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Cargando datos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Editar Alumno</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
              required
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
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  Sección {section.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            {isLoading ? 'Actualizando...' : 'Actualizar Alumno'}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;
