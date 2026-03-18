import api from '../config/axios';

export interface Grade {
  id: number;
  name: string;
  level: number;
}

export interface Section {
  id: number;
  name: string;
}

export interface Student {
  id?: number;
  name: string;
  lastname: string;
  birth_date: string;
  gender: 'M' | 'F';
  grade_id: number;
  section_id: number;
  grade?: Grade;
  section?: Section;
  created_at?: string;
  updated_at?: string;
}

export interface CreateStudentData {
  name: string;
  lastname: string;
  birth_date: string;
  gender: 'M' | 'F';
  grade_id: number;
  section_id: number;
}

export interface UpdateStudentData {
  name?: string;
  lastname?: string;
  birth_date?: string;
  gender?: 'M' | 'F';
  grade_id?: number;
  section_id?: number;
}

export interface CapacityInfo {
  grade_id: number;
  grade_name: string;
  grade_level: number;
  section_id: number;
  section_name: string;
  current_students: number;
  max_capacity: number;
  available_spots: number;
  is_full: boolean;
}

const studentsService = {
  getAll: async (): Promise<Student[]> => {
    try {
      const response = await api.get('/students', {
        timeout: 10000
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching students:', error);
      if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
      } else if (error.response?.status === 403) {
        throw new Error('No tiene permisos para ver los alumnos.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Tiempo de espera agotado. Intente nuevamente.');
      } else {
        throw new Error(error.response?.data?.message || 'Error al cargar los alumnos');
      }
    }
  },

  getById: async (id: number): Promise<Student> => {
    try {
      console.log('Fetching student with ID:', id);
      const response = await api.get(`/students/${id}`, {
        timeout: 10000
      });
      console.log('Student data received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching student:', error);
      if (error.response?.status === 404) {
        throw new Error(`Alumno no encontrado con ID: ${id}`);
      } else if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
      } else if (error.response?.status === 403) {
        throw new Error('No tiene permisos para ver este alumno.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Tiempo de espera agotado. Intente nuevamente.');
      } else {
        throw new Error(error.response?.data?.message || `Error al cargar el alumno con ID: ${id}`);
      }
    }
  },

  create: async (data: CreateStudentData): Promise<Student> => {
    try {
      const response = await api.post('/students', data, {
        timeout: 10000
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating student:', error);
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Datos inválidos');
      } else if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
      } else if (error.response?.status === 403) {
        throw new Error('No tiene permisos para crear alumnos.');
      } else {
        throw new Error(error.response?.data?.message || 'Error al crear el alumno');
      }
    }
  },

  update: async (id: number, data: UpdateStudentData): Promise<any> => {
    try {
      const response = await api.put(`/students/${id}`, data, {
        timeout: 10000
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating student:', error);
      if (error.response?.status === 404) {
        throw new Error('Alumno no encontrado');
      } else if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Datos inválidos');
      } else if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
      } else {
        throw new Error(error.response?.data?.message || 'Error al actualizar el alumno');
      }
    }
  },

  delete: async (id: number): Promise<any> => {
    try {
      const response = await api.delete(`/students/${id}`, {
        timeout: 10000
      });
      return response.data;
    } catch (error: any) {
      console.error('Error deleting student:', error);
      if (error.response?.status === 404) {
        throw new Error('Alumno no encontrado');
      } else if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
      } else if (error.response?.status === 403) {
        throw new Error('No tiene permisos para eliminar alumnos.');
      } else {
        throw new Error(error.response?.data?.message || 'Error al eliminar el alumno');
      }
    }
  },

  getCapacity: async (): Promise<CapacityInfo[]> => {
    try {
      const response = await api.get('/students/capacity', {
        timeout: 10000
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching capacity data:', error);
      if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
      } else if (error.response?.status === 403) {
        throw new Error('No tiene permisos para ver la información de capacidad.');
      } else {
        throw new Error(error.response?.data?.message || 'Error al cargar información de capacidad');
      }
    }
  },

  search: async (query: string): Promise<Student[]> => {
    try {
      const response = await api.get('/students/search', {
        params: { query },
        timeout: 10000
      });
      return response.data;
    } catch (error: any) {
      console.error('Error searching students:', error);
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Búsqueda inválida');
      } else if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
      } else if (error.response?.status === 403) {
        throw new Error('No tiene permisos para buscar alumnos.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Tiempo de espera agotado. Intente nuevamente.');
      } else {
        throw new Error(error.response?.data?.message || 'Error al buscar alumnos');
      }
    }
  },

  deleteAll: async (): Promise<{ message: string; deletedCount: number }> => {
    try {
      const response = await api.delete('/reports/students/delete-all', {
        timeout: 10000
      });
      return response.data;
    } catch (error: any) {
      console.error('Error deleting all students:', error);
      if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
      } else if (error.response?.status === 403) {
        throw new Error('Acceso denegado. Solo administradores pueden realizar esta acción.');
      } else {
        throw new Error(error.response?.data?.message || 'Error al eliminar todos los alumnos');
      }
    }
  }
};

export default studentsService;
