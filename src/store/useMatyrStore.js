import { create } from "zustand";
import { getGraveRows } from "../services/graveRowService";
import { getMatyrs } from "../services/martyrManagementService";

export const useMatyrStore = create((set, get) => ({
  matyrs: {},
  clearMartrys: () => set({ matyrs: {}, totalPages: 0 }),
  loadMatyrs: async (name, page, size, filters) => {
    // Get current matyrs from store
    const { matyrs } = get();
    alert(JSON.stringify(matyrs));
    // Check if page requested is not in cache
    if (!matyrs[page]) {
      try {
        const response = await getMatyrs(name, page, size, filters);
        // Get totalPages from response
        let results = response;
        alert("MISS THE CACHE!!!");
        set({
          matyrs: { ...matyrs, [page]: results },
          totalPages: response.totalPages,
        });
        // Return the data
        return results;
      } catch (error) {
        throw error;
      }
    } else {
      alert("HIT THE CACHE!!!");
      return matyrs[page];
    }
  },
}));
