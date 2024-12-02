import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useDashStore = create(
    persist(
    (set) => ({
    query: '',
    setQuery: (newQuery) => set((state)=> ({query: newQuery})),
	dashState: true,
    setDash: () => set((state) => ({ dashState: !state.dashState })),
    modeState: false,
    setMode: () => set((state) => ({ modeState: !state.modeState })),
    filterState: false,
    setFilter: () => set((state) => ({ filterState: !state.filterState })),
}),
{
    name: "vdPanel",
}));
