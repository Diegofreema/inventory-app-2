/* eslint-disable prettier/prettier */

import { create } from 'zustand';

type Store = {
  read: boolean;
  setRead: () => void;
  setUnread: () => void;
};

export const useRead = create<Store>((set) => ({
  read: true,
  setRead: () => {
    set({ read: true });
  },
  setUnread: () => {
    set({ read: false });
  },
}));
