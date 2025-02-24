/* eslint-disable prettier/prettier */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Store = {
  id: string;
  getId: (id: string) => void;
  removeId: () => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  staffId: string;
  getStaffId: (id: string) => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      id: '',
      staffId: '',
      getStaffId: (id: string) => {
        set({ staffId: id });
      },
      getId: (id: string) => {
        set({ id });
      },
      removeId: () => {
        set({ id: '', staffId: '' });
      },
      isAdmin: false,
      setIsAdmin: (isAdmin: boolean) => {
        set({ isAdmin });
      },
    }),
    {
      name: 'store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
