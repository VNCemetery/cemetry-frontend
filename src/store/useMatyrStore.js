import { create } from "zustand";
import { getGraveRows } from "../services/graveRowService";
import { getMatyrs } from "../services/martyrManagementService";

export const useMatyrStore = create((set, get) => ({
  totalPages: 0,
  currentSearchTerm: "",
  loading: false,
  error: null,

  selectedMartyr: null,
  selectMartyr: (martyr) => set({ selectedMartyr: martyr }),

  loadMatyrs: async (name, page = 0, size, filters) => {
    try {
      const response = await getMatyrs(name, page, size, filters);
      set({
        matyrs: response,
        totalPages: response.totalPages,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  clearMartrys: () => set({ matyrs: null }),

  // Admin section
  adminMartyrs: {
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    searchTerm: "",
  },

  loadAdminMartyrs: async (searchTerm = "", page = 1, size = 10) => {
    try {
      set((state) => ({
        adminMartyrs: {
          ...state.adminMartyrs,
          loading: true,
          error: null,
        },
      }));

      const response = await getMatyrs(searchTerm, page - 1, size);

      set((state) => ({
        adminMartyrs: {
          ...state.adminMartyrs,
          data: response,
          totalPages: response.totalPages,
          loading: false,
          currentPage: page,
          searchTerm,
        },
      }));

      return response;
    } catch (error) {
      set((state) => ({
        adminMartyrs: {
          ...state.adminMartyrs,
          loading: false,
          error: error.message,
        },
      }));
      throw error;
    }
  },
}));
