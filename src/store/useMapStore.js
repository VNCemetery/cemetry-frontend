import { create } from "zustand";

const initial = {
  currentPosition: {
    latitude: 0,
    longitude: 0,
  },
  currentHeading: 0,
};

export const useMapStore = create((set) => ({
  ...initial,
  setCurrentPosition: (newPosition) =>
    set({ currentPosition: { ...newPosition } }),
  setCurrentHeading: (heading) => set({ currentHeading: heading }),
}));
