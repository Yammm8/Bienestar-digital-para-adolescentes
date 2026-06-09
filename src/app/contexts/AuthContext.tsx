import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Usuario } from "../../types/database";
import { authService } from "../../services/auth";
import { syncPendingPostsToDb } from "../data/posts";

interface AuthContextType {
  user: Usuario | null;
  authUser: { email?: string; id?: string } | null;
  isLoggedIn: boolean;
  hasOnboarded: boolean;
  isLoading: boolean;
  error: string | null;
  completeOnboarding: () => void;
  updateUserProfile: (profile: Usuario) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (
    nombre: string,
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  authUser: null,
  isLoggedIn: false,
  hasOnboarded: false,
  isLoading: true,
  error: null,
  completeOnboarding: () => {},
  updateUserProfile: () => {},
  login: async () => ({ success: false, message: "" }),
  register: async () => ({ success: false, message: "" }),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [authUser, setAuthUser] = useState<{ email?: string; id?: string } | null>(null);
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar usuario al montar el componente
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
          if (userData) {
            setAuthUser(userData.auth ?? null);
            if (userData.profile) {
              setUser(userData.profile);
              setHasOnboarded(userData.profile.onboarded);
              await syncPendingPostsToDb(userData.profile.id, userData.profile.username);
            }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Escuchar cambios de autenticación
    const { data: subscription } = authService.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);

      if (event === "SIGNED_IN" && session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          setAuthUser(userData.auth ?? null);
          if (userData.profile) {
            setUser(userData.profile);
            setHasOnboarded(userData.profile.onboarded);
            await syncPendingPostsToDb(userData.profile.id, userData.profile.username);
          }
        }
      } else if (event === "SIGNED_OUT") {
        setAuthUser(null);
        setUser(null);
        setHasOnboarded(false);
        localStorage.removeItem("wb_settings");
        localStorage.removeItem("wb_communities");
        localStorage.removeItem("wb_following");
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.signin({ email, password });
      if (response.success) {
        setAuthUser(response.usuario ? { email, id: response.usuario.id } : null);
      }
      if (response.success && response.usuario) {
        setUser(response.usuario);
        setHasOnboarded(response.usuario.onboarded);
      } else {
        setError(response.error || response.message);
      }
      return { success: response.success, message: response.message };
    } catch (err: any) {
      const message = err.message || "Error en el login";
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (nombre: string, username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.signup({
        email,
        password,
        nombre,
        username,
      });
      if (response.success) {
        setHasOnboarded(false);
      } else {
        setError(response.error || response.message);
      }
      return { success: response.success, message: response.message };
    } catch (err: any) {
      const message = err.message || "Error en el registro";
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.signout();
      setUser(null);
      setHasOnboarded(false);
      localStorage.removeItem("wb_settings");
      localStorage.removeItem("wb_communities");
      localStorage.removeItem("wb_following");
    } catch (err: any) {
      const message = err.message || "Error cerrando sesión";
      setError(message);
      console.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    if (user) {
      const updated = await authService.updateUser(user.id, { onboarded: true });
      if (updated) {
        setUser(updated);
        setHasOnboarded(true);
      }
    }
  };

  const updateUserProfile = (profile: Usuario) => {
    setUser(profile);
  };

  const value: AuthContextType = {
    user,
    authUser,
    isLoggedIn: user !== null,
    hasOnboarded,
    isLoading,
    error,
    completeOnboarding,
    updateUserProfile,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
