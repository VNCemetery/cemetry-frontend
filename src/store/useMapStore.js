import { create } from "zustand";

const initial = {
  currentLocation: {
    accuracy: 0,
    latitude: 0,
    longitude: 0,
    heading: 0,
  },
};

export const useMapStore = create((set) => ({
  ...initial,
  setCurrentLocation: (location) => set({ currentLocation: location }),
  clearCurrentLocation: () =>
    set({
      ...initial,
    }),
}));
