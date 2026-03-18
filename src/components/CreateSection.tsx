import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import sectionsService, { type CreateSectionData } from '../services/sections.service';
import { getGrades, type Grade } from '../services/grades.service';

interface CreateSectionProps {
  onSectionCreated?: () => void;
}

const CreateSection: React.FC<CreateSectionProps> = ({ onSectionCreated }) => {
  const { token } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [formData, setFormData] = useState<CreateSectionData>({
    name: '',
    grade_id: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      const data = await getGrades();
      setGrades(data);
    } catch (err) {
      setError('Error al cargar los grados');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade_id' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre de la sección es requerido');
      return;
    }

    if (formData.name.length !== 1) {
      setError('El nombre de la sección debe ser exactamente un carácter');
      return;
    }

    if (!formData.grade_id || formData.grade_id === 0) {
      setError('Debe seleccionar un grado');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sectionsService.create(formData, token!);
      setSuccess('Sección creada exitosamente');
      setFormData({ name: '', grade_id: 0 });
      
      if (onSectionCreated) {
        onSectionCreated();
      }
    } catch (error: any) {
      console.error('Error creating section:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        setError(error.response.data.errors.map((err: any) => err.msg).join(', '));
      } else {
        setError('Error al crear la sección');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="grade_id" className="block text-sm font-medium text-gray-700 mb-2">
            Grado Educativo *
          </label>
          <div className="relative">
            <select
              id="grade_id"
              name="grade_id"
              value={formData.grade_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white"
              required
            >
              <option value="0">-- Seleccione un grado --</option>
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
          <p className="text-xs text-gray-500 mt-1">
            Selecciona el grado al que pertenecerá esta sección
          </p>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Sección *
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center text-2xl font-bold uppercase tracking-wider"
              placeholder="A"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs font-bold">A-Z</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ingresa una sola letra (A-Z) para identificar la sección
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-purple-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-purple-800">
              <p className="font-semibold mb-1">Importante:</p>
              <ul className="space-y-1 text-xs">
                <li>• Cada sección pertenece únicamente al grado seleccionado</li>
                <li>• Si creas "Sección A" para Primer Grado, será diferente de "Sección A" de Segundo Grado</li>
                <li>• Puedes tener múltiples secciones por grado (A, B, C, etc.)</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.name.trim() || !formData.grade_id}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando sección...
            </>
          ) : (
            <>
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Crear Sección
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateSection;
