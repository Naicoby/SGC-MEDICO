import axiosInstance from './axios';

export const profesionalesService = {
  getProfesionales: async (especialidad = '') => {
    const params = especialidad ? { especialidad } : {};
    const response = await axiosInstance.get('/profesionales/', { params });
    return response.data;
  },

  getProfesionalById: async (id) => {
    const response = await axiosInstance.get(`/profesionales/${id}/`);
    return response.data;
  },

  getDisponibilidad: async (id) => {
    const response = await axiosInstance.get(`/profesionales/${id}/disponibilidad/`);
    return response.data;
  },

  getHorariosDisponibles: async (id, fecha) => {
    const response = await axiosInstance.post(`/profesionales/${id}/horarios_disponibles/`, {
      profesional_id: id,
      fecha,
    });
    return response.data;
  },
};