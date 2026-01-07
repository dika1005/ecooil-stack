import { createSignal, createRoot } from "solid-js";
import { type User } from "~/types";

function createAuthStore() {
  // Initialize user from localStorage if available (client-side only)
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

  const [user, setUser] = createSignal<User | null>(storedUser ? JSON.parse(storedUser) : null);
  const [isLoading, setIsLoading] = createSignal(false);

  const login = (newUser: User) => {
    setUser(newUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  };

  const logout = async () => {
    // Call logout API to clear cookie
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout error:", e);
    }

    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const isAuthenticated = () => !!user();

  return { user, isLoading, setIsLoading, login, logout, isAuthenticated, setUser };
}

export const authStore = createRoot(createAuthStore);
