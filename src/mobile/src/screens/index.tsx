import React from "react";
import { Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useTheme } from "../components/theme";
import AudioScreen from "./audio/AudioScreen";
import DiscoverScreen from "./discover/DiscoverScreen";
import NotificationsScreen from "./notifications/NotificationsScreen";
import ProfileScreen from "./profile/ProfileScreen";
import SkoopScreen from "./skoop/SkoopScreen";

type ScreenProps = {
  name: string;
  component: React.ComponentType;
  icon: string;
  headerRight?:
    | ((props: {
        tintColor?: string | undefined;
        pressColor?: string | undefined;
        pressOpacity?: number | undefined;
      }) => React.ReactNode)
    | undefined;
};

export const SCREENS: ScreenProps[] = [
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
    headerRight: () => {
      const theme = useTheme();
      return (
        <Pressable style={theme.components.buttonPadded}>
          <Icon name="menu" size={32} color={theme.components.button.color} />
        </Pressable>
      );
    },
  },
];
