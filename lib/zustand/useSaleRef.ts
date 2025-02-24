/* eslint-disable prettier/prettier */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Store = {
  saleRef: string;
  getSaleRef: (ref: string) => void;
  removeSaleRef: () => void;
};

export const useGetRef = create<Store>()(
  persist(
    (set) => ({
      saleRef: '',
      getSaleRef: (ref: string) => {
        set({ saleRef: ref });
      },
      removeSaleRef: () => {
        set({ saleRef: '' });
      },
    }),
    {
      name: 'ref',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
