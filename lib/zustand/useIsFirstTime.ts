/* eslint-disable prettier/prettier */

import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

type Store = {
  hasFetched: boolean;
  setHasFetched: (hasFetched: boolean) => void;
};

const hasFetched = SecureStore.getItem('hasFetched');
export const useHasFetched = create<Store>((set) => ({
  hasFetched: !!hasFetched,
  setHasFetched: (hasFetched: boolean) => {
    set({ hasFetched });
    SecureStore.setItem('hasFetched', JSON.stringify(hasFetched));
  },
}));
