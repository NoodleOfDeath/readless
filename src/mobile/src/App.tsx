import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MenuProvider } from "react-native-popup-menu";

import SessionContextProvider, {
  SessionContext,
} from "./contexts/SessionContext";

import { SCREENS} from "./screens";
import { useTheme } from "./components/theme";
import { linkingOptions } from "./types";

import OnboardingScreen from './screens/onboarding/OnboardingScreen';

export default function TabController() {
  const theme = useTheme();
  const Tab = createBottomTabNavigator();
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  return (
    <SessionContextProvider>
      <MenuProvider>
        <NavigationContainer
          theme={{
            dark: !theme.isLightMode,
            colors: theme.navContainerColors,
          }}
          linking={linkingOptions}
        >
          {showOnboarding ? (
            <OnboardingScreen />
          ) : (
            <Tab.Navigator
              initialRouteName="Discover"
              screenOptions={
                React.useContext(SessionContext).tabControllerScreenOptions
              }
            >
              {SCREENS.map((screen) => (
                <Tab.Screen
                  key={screen.name}
                  name={screen.name}
                  component={screen.component}
                  options={{
                    tabBarIcon: (props) => <Icon name={screen.icon} {...props} />,
                    headerRight: screen.headerRight,
                  }}
                />
              ))}
            </Tab.Navigator>
          )}
        </NavigationContainer>
      </MenuProvider>
    </SessionContextProvider>
  );
}
