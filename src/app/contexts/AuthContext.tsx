import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthUser {
  name: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  hasOnboarded: false,
  completeOnboarding: () => {},
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadJSON("auth_user", null));
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => loadJSON("auth_onboarded", false));

  // Persist to localStorage on change
  useEffect(() => {
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else localStorage.removeItem("auth_user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("auth_onboarded", JSON.stringify(hasOnboarded));
  }, [hasOnboarded]);

  const login = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const savedUser = loadJSON<AuthUser | null>("auth_user", null);
    // Reuse saved profile if same email, otherwise use default
    const resolvedUser = savedUser?.email === email
      ? savedUser
      : { name: "María García", username: "maria", email };
    setUser(resolvedUser);
    setHasOnboarded(true);
  };

  const register = async (name: string, username: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    setUser({ name, username, email });
    setHasOnboarded(false);
  };

  const logout = () => {
    setUser(null);
    setHasOnboarded(false);
    localStorage.removeItem("auth_user");
    localStorage.setItem("auth_onboarded", "false");
    // Reset wellbeing settings so next user starts fresh from onboarding
    localStorage.removeItem("wb_settings");
    localStorage.removeItem("wb_communities");
    localStorage.removeItem("wb_following");
  };

  const completeOnboarding = () => setHasOnboarded(true);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: user !== null,
      hasOnboarded,
      completeOnboarding,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
