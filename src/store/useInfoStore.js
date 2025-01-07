import { create } from "zustand";
import { getGraveRows } from "../services/graveRowService";

export const useInfoStore = create((set, get) => ({
  grave_rows: [],
  grave_rows_entries: [],
  findGraveRowIdByName: (name) => {
    let grave_rows = get().grave_rows_entries;
    let entry = grave_rows.find((row) => row.rowName === name);
    let grave_row_id = entry ? entry.id : null;
    return grave_row_id;
  },

  isLoadingInfo: false,
  loadInfo: async () => {
    // Call service
    // set loading
    try {
      set({ isLoadingInfo: true });
      let grave_rows = await getGraveRows();
      let grave_rows_entries = grave_rows;
      // Build from grave rows list
      if (grave_rows.length > 0) {
        let formatted_grave_rows = grave_rows.reduce((acc, row) => {
          if (!acc[row.areaName]) {
            acc[row.areaName] = [];
          }
          acc[row.areaName].push(row);
          return acc;
        }, {});

        set({
          grave_rows_entries: grave_rows_entries,
          grave_rows: formatted_grave_rows,
          isLoading: false,
        });
      }
      set({ isLoadingInfo: false });
    } catch (error) {
      alert("Error when loading data");
      set({ isLoadingInfo: false });
    }
  },
}));
