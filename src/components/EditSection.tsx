import React, { useState } from 'react';
import sectionsService, { type Section, type UpdateSectionData } from '../services/sections.service';

interface EditSectionProps {
  section: Section;
  onSectionUpdated?: () => void;
  onCancel?: () => void;
}

const EditSection: React.FC<EditSectionProps> = ({ section, onSectionUpdated, onCancel }) => {
  const [formData, setFormData] = useState<UpdateSectionData>({
    name: section.name
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.name.trim().length !== 1) {
      setError('El nombre de la sección debe ser exactamente un carácter (A-Z)');
      return;
    }

    if (!/^[A-Z]$/.test(formData.name.toUpperCase())) {
      setError('El nombre de la sección debe ser una letra mayúscula (A-Z)');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sectionsService.update(section.id!, formData);
      setSuccess('Sección actualizada exitosamente');
      
      if (onSectionUpdated) {
        onSectionUpdated();
      }
      
      setTimeout(() => {
        if (onCancel) {
          onCancel();
        }
      }, 1500);
    } catch (error: any) {
      console.error('Error updating section:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        setError(error.response.data.errors.map((err: any) => err.msg || err.message).join(', '));
      } else {
        setError(error.message || 'Error al actualizar la sección');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Editar Sección</h2>
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
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Sección
          </label>
          <select
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Seleccione una sección</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Seleccione la letra correspondiente a la sección
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            {isLoading ? 'Actualizando...' : 'Actualizar Sección'}
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

export default EditSection;
