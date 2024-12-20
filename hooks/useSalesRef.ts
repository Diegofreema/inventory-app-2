import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Store = {
  saleRefs: string[];
  addSaleRef: (saleRefs: string) => void;
};

export const useSalesRef = create<Store>()(
  persist(
    (set, get) => ({
      saleRefs: [],
      addSaleRef: (saleRefs: string) => {
        set(() => ({ saleRefs: [saleRefs, ...get().saleRefs] }));
      },
    }),
    {
      name: 'salesRef',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
