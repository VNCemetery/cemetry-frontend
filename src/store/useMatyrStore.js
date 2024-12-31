import { create } from "zustand";
import { getGraveRows } from "../services/graveRowService";
import { getMatyrs } from "../services/martyrManagementService";

export const useMatyrStore = create((set, get) => ({
  matyrs: {},
  selectedMartyr: null,
  selectMartyr: (martyr) => set({ selectedMartyr: martyr }),
  clearMartrys: () => set({ matyrs: {}, totalPages: 0 }),
  loadMatyrs: async (name, page, size, filters) => {
    // Get current matyrs from store
    const { matyrs } = get();
    // Check if page requested is not in cache
    if (!matyrs[page]) {
      try {
        const response = await getMatyrs(name, page, size, filters);
        // Get totalPages from response
        let results = response;
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
      return matyrs[page];
    }
  },
}));
