import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
export type ProductUpdatePrice = {
  name: string;
  price: number;
  id: string;
  storeId: string;
};

type Store = {
  offlineProducts: ProductUpdatePrice[];
  addProduct: (product: ProductUpdatePrice) => void;
  removeProduct: (id: string) => void;
};

export const useProductUpdatePrice = create<Store>()(
  persist((set) => ({
      offlineProducts: [],
      addProduct: (product: ProductUpdatePrice): void => {
        set((state) => ({ offlineProducts: [...state.offlineProducts, product] }))
      },
      removeProduct: (id: string): void => {
        set((state) => {
          return { offlineProducts: state.offlineProducts.filter((p) => p.id !== id) }
        });
      },
    }),
    { name: 'offlineProducts', storage: createJSONStorage(() => AsyncStorage) }
  )
);
