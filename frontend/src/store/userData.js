import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserDataStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user: user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'userData',
    }
  )
);
