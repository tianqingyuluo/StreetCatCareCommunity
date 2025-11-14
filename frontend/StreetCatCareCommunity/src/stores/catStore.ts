import { create } from "zustand";

interface CatState {
    selectedCatId: number | null;
    setSelectedCatId: (id: number) => void;
}

export const useCatStore = create<CatState>((set) => ({
    selectedCatId: null,
    setSelectedCatId: (id: number) => set({ selectedCatId: id }),
}));