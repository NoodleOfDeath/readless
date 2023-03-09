import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ResultsView from "./ResultsView";
import PostScreen from "../post/PostScreen";
import { RootStackParamList } from "./types";

export default function HomeScreen() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={ResultsView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Post"
        component={PostScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}
