import axiosInstance from './axios';

export const citasService = {
  getMisCitas: async () => {
    const response = await axiosInstance.get('/citas/');
    return response.data;
  },

  getProximasCitas: async () => {
    const response = await axiosInstance.get('/citas/mis_proximas_citas/');
    return response.data;
  },

  getCitaById: async (id) => {
    const response = await axiosInstance.get(`/citas/${id}/`);
    return response.data;
  },

  crearCita: async (citaData) => {
    const response = await axiosInstance.post('/citas/', citaData);
    return response.data;
  },

  cancelarCita: async (id, motivo) => {
    const response = await axiosInstance.post(`/citas/${id}/cancelar/`, {
      motivo_cancelacion: motivo,
    });
    return response.data;
  },

  confirmarCita: async (id) => {
    const response = await axiosInstance.post(`/citas/${id}/confirmar/`);
    return response.data;
  },
};