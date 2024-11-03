import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ProductUpdateQty = {
  name: string;
  qty: number;
  id: string;
  storeId: string;
};

type Store = {
  offlineProducts: ProductUpdateQty[];
  addProduct: (product: ProductUpdateQty) => void;
  removeProduct: (id: string) => void;
};

export const useProductUpdateQty = create<Store>()(
  persist(
    (set) => ({
      offlineProducts: [],
      addProduct: (product: ProductUpdateQty): void => {
        set((state) => ({ offlineProducts: [...state.offlineProducts, product] }));
      },
      removeProduct: (id: string): void => {
        set((state) => ({
          offlineProducts: state.offlineProducts.filter((p) => p.id !== id),
        }));
      },
    }),
    { name: 'offlineQty', storage: createJSONStorage(() => AsyncStorage) }
  )
);
