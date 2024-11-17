import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
    // @ts-ignore
    (set) => ({
      offlineProducts: [],
      addProduct: (product) =>
        set((state) => ({
          offlineProducts: [...state.offlineProducts, product],
        })),
      removeProduct: (id) =>
        set((state) => ({
          offlineProducts: state.offlineProducts.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'offlineQty',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: (state) => {
        // Optional: Handle rehydration completion
        return (state, error) => {
          if (error) {
            console.error('Error rehydrating offlineQty:', error);
          } else {
            console.log('offlineQty storage rehydrated');
          }
        };
      },
    }
  )
);
