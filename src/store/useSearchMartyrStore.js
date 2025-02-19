import { create } from "zustand";
import { useMatyrStore } from "./useMatyrStore";
import { getMatyrs } from "../services/martyrManagementService";
import { DEFAULT_SEARCH_SIZE } from "../utils/constants";

export const useSearchMartyrStore = create((set, get) => ({
  searchResults: null,
  isLoadingSearchResults: false,
  showSearchResults: false,
  filterQuery: [],
  currentPage: 0,
  filters: {
    graveRow: {
      areaName: "",
      rowName: "",
    },
  },
  searchKey: "",
  showAutoSuggestions: false,
  autoSuggestions: [],

  // Setters
  setFilterQuery: (filters) => set({ filterQuery: filters }),
  setSearchResults: (results) => set({ searchResults: results }),
  setIsLoadingSearchResults: (isLoading) =>
    set({ isLoadingSearchResults: isLoading }),
  setShowSearchResults: (show) => set({ showSearchResults: show }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setFilters: (filters) => set({ filters }),
  setSearchKey: (key) => set({ searchKey: key }),
  setShowAutoSuggestions: (show) => set({ showAutoSuggestions: show }),
  setAutoSuggestions: (suggestions) => set({ autoSuggestions: suggestions }),

  handleSearch: async ({
    name = "",
    page = 0,
    size = DEFAULT_SEARCH_SIZE,
    filters = [],
    sorts = [],
  }) => {
    try {
      set({
        searchResults: null,
        isLoadingSearchResults: true,
        showSearchResults: false,
      });

      const results = await getMatyrs(name, page, size, filters, sorts);

      if (!results) {
        setSearchResults(null);
        throw new Error("No result found");
      }
      set({
        searchResults: results,
        isLoadingSearchResults: false,
        showSearchResults: true,
      });
    } catch (error) {
      set({
        searchResults: null,
        isLoadingSearchResults: false,
        showSearchResults: false,
      });
    }
  },
}));
