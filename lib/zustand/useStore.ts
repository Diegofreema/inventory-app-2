/* eslint-disable prettier/prettier */

import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
type Store = {
  id: string | null;
  getId: (id: string) => void;
  removeId: () => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
};
const admin = SecureStore.getItem('admin');
export const useStore = create<Store>()(persist(
  (set) => ({
  id: SecureStore.getItem('id') || '',
  getId: (id: string) => {
    set({ id });
    SecureStore.setItem('id', id);
  },
  removeId: () => {
    set({ id: null });
    SecureStore.deleteItemAsync('id');
  },
  isAdmin: !!admin,
  setIsAdmin: (isAdmin: boolean) => {
    set({ isAdmin });
    SecureStore.setItem('admin', JSON.stringify(isAdmin));
  },
}
),
  {
    name: 'store',
    storage: createJSONStorage(() => AsyncStorage),
  }

));
