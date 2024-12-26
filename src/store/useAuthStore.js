import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: null,
  login: (username, password) => {
    // Thực hiện login API call ở đây
    // Tạm thời mock response
    if (username === "admin" && password === "admin") {
      set({ token: "fake-token" });
      return Promise.resolve();
    }
    return Promise.reject("Invalid credentials");
  },
  logout: () => set({ token: null }),
}));
