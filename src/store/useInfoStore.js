import { create } from "zustand";
import { getGraveRows } from "../services/graveRowService";

export const useInfoStore = create((set) => ({
  grave_rows: [],

  isLoadingInfo: false,
  loadInfo: async () => {
    // Call service
    // set loading
    try {
      set({ isLoadingInfo: true });
      let grave_rows = await getGraveRows();
      // Build from grave rows list
      if (grave_rows.length > 0) {
        let formatted_grave_rows = grave_rows.reduce((acc, row) => {
          if (!acc[row.areaName]) {
            acc[row.areaName] = [];
          }
          acc[row.areaName].push(row);
          return acc;
        }, {});

        set({ grave_rows: formatted_grave_rows, isLoading: false });
      }
      set({ isLoadingInfo: false });
    } catch (error) {
      alert("Error when loading data");
      set({ isLoadingInfo: false });
    }
  },
}));
