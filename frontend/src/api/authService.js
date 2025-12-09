import axiosInstance from './axios';

export const authService = {
  login: async (rut, password) => {
    const response = await axiosInstance.post('/auth/login/', {
      rut,
      password,
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register/', userData);
    return response.data;
  },

  logout: async (refreshToken) => {
    try {
      await axiosInstance.post('/auth/logout/', {
        refresh: refreshToken,
      });
    } catch (error) {
      console.error('Error en logout:', error);
    }
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/usuarios/me/');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await axiosInstance.put('/usuarios/update_profile/', userData);
    return response.data;
  },

  changePassword: async (oldPassword, newPassword, newPasswordConfirm) => {
    const response = await axiosInstance.post('/usuarios/change_password/', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    });
    return response.data;
  },
};