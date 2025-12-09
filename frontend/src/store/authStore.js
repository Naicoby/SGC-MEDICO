import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
      },

      isAdmin: () => {
        const state = useAuthStore.getState();
        return state.user?.rol === 'ADMIN';
      },

      isProfesional: () => {
        const state = useAuthStore.getState();
        return state.user?.rol === 'PROFESIONAL';
      },

      isPaciente: () => {
        const state = useAuthStore.getState();
        return state.user?.rol === 'PACIENTE';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);