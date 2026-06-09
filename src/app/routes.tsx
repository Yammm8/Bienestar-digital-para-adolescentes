import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Onboarding } from "./components/Onboarding";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Feed } from "./components/Feed";
import { Create } from "./components/Create";
import { Communities } from "./components/Communities";
import { CommunityDetail } from "./components/CommunityDetail";
import { Wellbeing } from "./components/Wellbeing";
import { Metrics } from "./components/Metrics";
import { Activities } from "./components/Activities";
import { Notifications } from "./components/Notifications";
import { Profile } from "./components/Profile";
import { PublicProfile } from "./components/PublicProfile";
import { Search } from "./components/Search";
import { SettingsAccount } from "./components/SettingsAccount";
import { ProtectedRoute } from "./contexts/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  {
    path: "/onboarding",
    Component: () => (
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    Component: () => (
      <ProtectedRoute requireOnboarded>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Feed },
      { path: "create", Component: Create },
      { path: "communities", Component: Communities },
      { path: "communities/:slug", Component: CommunityDetail },
      { path: "wellbeing", Component: Wellbeing },
      { path: "metrics", Component: Metrics },
      { path: "activities", Component: Activities },
      { path: "notifications", Component: Notifications },
      { path: "profile", Component: Profile },
      { path: "users/:username", Component: PublicProfile },
      { path: "search", Component: Search },
      { path: "settings", Component: SettingsAccount },
    ],
  },
]);
