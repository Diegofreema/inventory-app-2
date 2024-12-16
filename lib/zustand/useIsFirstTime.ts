/* eslint-disable prettier/prettier */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Store = {
  hasFetched: boolean;
  setHasFetched: (hasFetched: boolean) => void;
};

export const useHasFetched = create<Store>()(
  persist(
    (set) => ({
      hasFetched: false,
      setHasFetched: (hasFetched: boolean) => {
        set({ hasFetched });
      },
    }),
    { name: 'hasFetched', storage: createJSONStorage(() => AsyncStorage) }
  )
);
