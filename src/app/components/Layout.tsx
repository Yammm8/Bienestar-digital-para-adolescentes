import { Outlet, NavLink } from "react-router";
import { Home, PlusCircle, Users, Heart, Bell, User } from "lucide-react";

export function Layout() {
  const navItems = [
    { to: "/", icon: Home, label: "Feed" },
    { to: "/create", icon: PlusCircle, label: "Crear" },
    { to: "/communities", icon: Users, label: "Comunidad" },
    { to: "/wellbeing", icon: Heart, label: "Bienestar" },
    { to: "/notifications", icon: Bell, label: "Notif." },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-green-50">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-inset-bottom">
        <div className="max-w-md mx-auto flex justify-around items-center">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-emerald-600"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
