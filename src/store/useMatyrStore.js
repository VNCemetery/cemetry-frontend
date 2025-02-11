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
  updateMartyrInStore: (id, newMartyrData) => {
    const currentMatyrs = get().matyrs;
    if (!currentMatyrs || !currentMatyrs.content) return;
    
    const updatedContent = currentMatyrs.content.map((martyr) => {
      if (martyr.id === id) {
        // Preserve the graveRow data from the original martyr
        return { ...martyr, ...newMartyrData };
      }
      return martyr;
    });

    set({ 
      matyrs: { 
        ...currentMatyrs,
        content: updatedContent 
      } 
    });
  },
  deleteMartyrInStore: (id) => {
    const currentMatyrs = get().matyrs;
    if (!currentMatyrs || !currentMatyrs.content) return { success: false };
    
    const currentContent = currentMatyrs.content;
    const isLastPage = currentMatyrs.number === currentMatyrs.totalPages - 1;
    const isLastItemOnPage = currentContent.length === 1;
    
    // If this is the last item on the last page
    if (isLastPage && isLastItemOnPage) {
      return { 
        success: true, 
        needsReload: true,
        previousPage: Math.max(0, currentMatyrs.number - 1)
      };
    }
    
    // Normal deletion flow
    const updatedContent = currentContent.filter(martyr => martyr.id !== id);
    const wasDeleted = updatedContent.length < currentContent.length;
    
    if (wasDeleted) {
      const newTotalElements = currentMatyrs.totalElements - 1;
      const pageSize = currentMatyrs.size || 10;
      const newTotalPages = Math.max(1, Math.ceil(newTotalElements / pageSize));
      
      set({ 
        matyrs: { 
          ...currentMatyrs,
          content: updatedContent,
          totalElements: newTotalElements,
          totalPages: newTotalPages
        },
        totalPages: newTotalPages
      });
    }
    
    return { success: wasDeleted, needsReload: false };
  },
  loadMartyrs: async (name, page = 0, size, filters) => {
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
  adminMartyrs: {
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    searchTerm: "",
  },
  loadAdminMartyrs: async (
    searchTerm = "",
    page = 1,
    size = 10,
    filters = {}
  ) => {
    try {
      set((state) => ({
        adminMartyrs: {
          ...state.adminMartyrs,
          loading: true,
          error: null,
        },
      }));

      const validFilters = {
        hometown: filters.hometown?.trim() || null,
        yearOfBirth: filters.yearOfBirth
          ? filters.yearOfBirth.toString()
          : null,
        yearOfDeath: filters.yearOfDeath
          ? filters.yearOfDeath.toString()
          : null,
      };

      const response = await getMatyrs(
        searchTerm,
        page - 1,
        size,
        validFilters
      );

      set((state) => ({
        adminMartyrs: {
          ...state.adminMartyrs,
          data: response,
          totalPages: response.totalPages || 0,
          loading: false,
          currentPage: page,
          searchTerm,
        },
      }));

      return response;
    } catch (error) {
      console.error("Load martyrs error:", error);
      set((state) => ({
        adminMartyrs: {
          ...state.adminMartyrs,
          loading: false,
          error: error.message || "Không thể tải danh sách liệt sĩ",
        },
      }));
      throw error;
    }
  },

  clearAdminCache: () => {
    set((state) => ({
      adminMartyrs: {
        ...state.adminMartyrs,
        data: null,
      },
    }));
  },
}));
