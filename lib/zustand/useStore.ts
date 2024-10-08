/* eslint-disable prettier/prettier */

import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
type Store = {
  id: string | null;
  getId: (id: string) => void;
  removeId: () => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
};
const admin = SecureStore.getItem('admin');
export const useStore = create<Store>((set) => ({
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
}));
