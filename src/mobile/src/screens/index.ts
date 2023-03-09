import AudioScreen from "./audio/AudioScreen";
import DiscoverScreen from "./discover/DiscoverScreen";
import NotificationsScreen from "./notifications/NotificationsScreen";
import ProfileScreen from "./profile/ProfileScreen";
import SkoopScreen from "./skoop/SkoopScreen";

export const SCREENS = [
  {
    name: "Discover",
    component: DiscoverScreen,
    icon: "fire",
  },
  {
    name: "Skoop+",
    component: SkoopScreen,
    icon: "silverware-spoon",
  },
  {
    name: "Audio",
    component: AudioScreen,
    icon: "headphones",
  },
  {
    name: "Notifications",
    component: NotificationsScreen,
    icon: "bell",
  },
  {
    name: "Profile",
    component: ProfileScreen,
    icon: "account",
  },
] as const;
