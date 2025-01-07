import { create } from "zustand";
import { getGraveRows } from "../services/graveRowService";
import { getMatyrs } from "../services/martyrManagementService";

export const useMatyrStore = create((set, get) => ({
  // Cache object để lưu trữ data theo từng trang và search term
  cache: {
    pages: {}, // Format: { "searchTerm_pageNumber": data }
    timestamp: {}, // Lưu thời gian cache để có thể invalidate sau một thời gian
  },
  totalPages: 0,
  currentSearchTerm: "",
  loading: false,
  error: null,

  // Thời gian cache hết hạn (5 phút)
  CACHE_EXPIRY: 5 * 60 * 1000,

  // Load martyrs với cache
  loadMatyrs: async (searchTerm = "", page = 0, size = 10) => {
    const store = get();
    const cacheKey = `${searchTerm}_${page}`;

    // Check if data exists in cache and is not expired
    const cachedData = store.cache.pages[cacheKey];
    const cachedTime = store.cache.timestamp[cacheKey];
    const isExpired = cachedTime && (Date.now() - cachedTime > store.CACHE_EXPIRY);

    if (cachedData && !isExpired) {
      console.log('Cache hit for:', cacheKey);
      return cachedData;
    }

    try {
      set({ loading: true, error: null });
      console.log('Cache miss for:', cacheKey, 'Fetching from API...');

      const response = await getMatyrs(searchTerm, page, size);

      // Update cache
      set(state => ({
        cache: {
          pages: {
            ...state.cache.pages,
            [cacheKey]: response
          },
          timestamp: {
            ...state.cache.timestamp,
            [cacheKey]: Date.now()
          }
        },
        totalPages: response.totalPages,
        currentSearchTerm: searchTerm,
        loading: false
      }));

      return response;
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
      throw error;
    }
  },

  // Clear cache cho một trang cụ thể
  clearPageCache: (searchTerm = "", page = 0) => {
    const cacheKey = `${searchTerm}_${page}`;
    set(state => ({
      cache: {
        pages: {
          ...state.cache.pages,
          [cacheKey]: undefined
        },
        timestamp: {
          ...state.cache.timestamp,
          [cacheKey]: undefined
        }
      }
    }));
  },

  // Clear toàn bộ cache
  clearAllCache: () => {
    set({
      cache: {
        pages: {},
        timestamp: {}
      }
    });
  },

  // Invalidate cache cũ hơn thời gian cho phép
  invalidateOldCache: () => {
    const store = get();
    const now = Date.now();

    const newTimestamp = {};
    const newPages = {};

    Object.keys(store.cache.timestamp).forEach(key => {
      if (now - store.cache.timestamp[key] < store.CACHE_EXPIRY) {
        newTimestamp[key] = store.cache.timestamp[key];
        newPages[key] = store.cache.pages[key];
      }
    });

    set({
      cache: {
        pages: newPages,
        timestamp: newTimestamp
      }
    });
  },

  // Phần code cũ giữ nguyên
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

  // Thêm các state và actions mới cho quản lý danh sách
  adminMartyrs: {
    data: {},
    loading: false,
    error: null,
    totalPages: 0,
    currentPage: 1,
    searchTerm: ""
  },

  // Load danh sách cho trang admin
  loadAdminMartyrs: async (searchTerm = "", page = 1, size = 10) => {
    const store = get();
    const cacheKey = `${searchTerm}_${page}`;

    // Kiểm tra cache
    if (store.adminMartyrs.data[cacheKey]) {
      return store.adminMartyrs.data[cacheKey];
    }

    try {
      set(state => ({
        adminMartyrs: {
          ...state.adminMartyrs,
          loading: true,
          error: null
        }
      }));

      const response = await getMatyrs(searchTerm, page - 1, size);

      set(state => ({
        adminMartyrs: {
          ...state.adminMartyrs,
          data: {
            ...state.adminMartyrs.data,
            [cacheKey]: response
          },
          totalPages: response.totalPages,
          loading: false,
          currentPage: page,
          searchTerm
        }
      }));

      return response;
    } catch (error) {
      set(state => ({
        adminMartyrs: {
          ...state.adminMartyrs,
          loading: false,
          error: error.message
        }
      }));
      throw error;
    }
  },

  // Clear cache của một trang cụ thể trong admin
  clearAdminCache: (searchTerm = "", page = 1) => {
    const cacheKey = `${searchTerm}_${page}`;
    set(state => ({
      adminMartyrs: {
        ...state.adminMartyrs,
        data: {
          ...state.adminMartyrs.data,
          [cacheKey]: undefined
        }
      }
    }));
  },

  // Clear toàn bộ cache trong admin
  clearAllAdminCache: () => {
    set(state => ({
      adminMartyrs: {
        ...state.adminMartyrs,
        data: {},
        totalPages: 0
      }
    }));
  }
}));
