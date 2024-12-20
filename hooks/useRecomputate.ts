import { create } from 'zustand';

type Store = {
  reload: boolean;
  toggle: () => void;
};

export const useReCompute = create<Store>((set, get) => ({
  reload: false,
  toggle: () => set({ reload: !get().reload }),
}));
