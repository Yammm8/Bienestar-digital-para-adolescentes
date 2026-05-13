import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Onboarding } from "./components/Onboarding";
import { Feed } from "./components/Feed";
import { Create } from "./components/Create";
import { Communities } from "./components/Communities";
import { CommunityDetail } from "./components/CommunityDetail";
import { Wellbeing } from "./components/Wellbeing";
import { Notifications } from "./components/Notifications";
import { Profile } from "./components/Profile";

export const router = createBrowserRouter([
  {
    path: "/onboarding",
    Component: Onboarding,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Feed },
      { path: "create", Component: Create },
      { path: "communities", Component: Communities },
      { path: "communities/:slug", Component: CommunityDetail },
      { path: "wellbeing", Component: Wellbeing },
      { path: "notifications", Component: Notifications },
      { path: "profile", Component: Profile },
    ],
  },
]);
