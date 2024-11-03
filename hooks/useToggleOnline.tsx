import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ToggleOnlineOptions = {
  customerProductId: string;
  online: '0' | '1';
  price: string;
  productId: string;
  qty: string;
  sellingPrice: string;
  dealerShare: string;
  netProShare: string;
};
type Store = {
  product: ToggleOnlineOptions[];
  getProduct: (product: ToggleOnlineOptions) => void;
  removeProduct: (productId: string) => void;
};

export const useToggleOnline = create<Store>()(
  persist(
    // @ts-ignore
    (set) => ({
      product: [],
      getProduct: (product: ToggleOnlineOptions) => {
        set((state) => {
          const productInStore = state.product.findIndex((p) => p.productId === product.productId);

          if (productInStore !== -1) {
            state.product[productInStore].online =
              state.product[productInStore].online === '0' ? '1' : '0';
            return { product: state.product };
          }

          return { product: [...state.product, product] };
        });
      },
      removeProduct: (productId: string) => {
        set((state) => {
          const filteredArray = state.product.filter((item) => item.productId === productId);
          return { product: filteredArray };
        });
      },
    }),
    {
      name: 'toggleOnline',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
