import { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { Home, PlusCircle, Users, Heart, Search, User } from "lucide-react";
import { useWellbeing } from "../contexts/WellbeingContext";
import { useAuth } from "../contexts/AuthContext";
import { BreakScreen } from "./BreakScreen";
import { UsageAlerts, QuickPauseButton } from "./UsageAlerts";
import { ActivitySuggestionCard } from "./ActivitySuggestionCard";
import { ActiveActivityOverlay } from "./ActiveActivityOverlay";
import { OfflineReturnConfirm } from "./OfflineReturnConfirm";

export function Layout() {
  const { frictionStyle, isPaused, showReturnConfirm } = useWellbeing();
  const { isLoggedIn, hasOnboarded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate("/login", { replace: true });
    else if (!hasOnboarded) navigate("/onboarding", { replace: true });
  }, [isLoggedIn, hasOnboarded, navigate]);

  const navItems = [
    { to: "/", icon: Home, label: "Feed" },
    { to: "/create", icon: PlusCircle, label: "Crear" },
    { to: "/search", icon: Search, label: "Buscar" },
    { to: "/communities", icon: Users, label: "Comunidades" },
    { to: "/wellbeing", icon: Heart, label: "Bienestar" },
    { to: "/profile", icon: User, label: "Perfil" },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-green-50">
      {/* Main content — friction filter applied here */}
      <main className="flex-1 overflow-y-auto pb-20" style={frictionStyle}>
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-1.5 safe-area-inset-bottom z-20">
        <div className="max-w-md mx-auto flex justify-around items-center">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors ${
                  isActive ? "text-emerald-600" : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Always-on usage alerts (UC-20, UC-21) */}
      <UsageAlerts />

      {/* Quick-pause FAB — hidden when already paused (UC-22) */}
      {!isPaused && <QuickPauseButton />}

      {/* Offline activity overlay — fullscreen or minimized banner (UC-24) */}
      <ActiveActivityOverlay />

      {/* Break screen — full-screen overlay when paused (UC-22) */}
      {isPaused && <BreakScreen />}

      {/* UC-24: Activity suggestion card — slides up over any screen */}
      <ActivitySuggestionCard />

      {/* UC-25: Return confirmation after offline activity */}
      {showReturnConfirm && <OfflineReturnConfirm />}
    </div>
  );
}
