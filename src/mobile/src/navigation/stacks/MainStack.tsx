import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BottomTabNavigator } from '../BottomTabNavigator';

import { strings } from '~/locales';
import {
  AccountScreen,
  AchievementScreen,
  AchievementsScreen,
  BookmarksScreen,
  CategoryPickerScreen,
  CategoryScreen,
  ColorSchemePickerScreen,
  DisplayPreferencesScreen,
  FontPickerScreen,
  GeneralSettingsScreen,
  LeaderboardsScreen,
  LegalScreen,
  NotificationScreen,
  NotificationSettingsScreen,
  NotificationsScreen,
  PublisherPickerScreen,
  PublisherScreen,
  ReadingFormatPickerScreen,
  RecapScreen,
  RoutingParams,
  SearchScreen,
  SettingsScreen,
  ShortPressFormatPickerScreen,
  StatsScreen,
  SummaryScreen,
  TestScreen,
} from '~/screens';

const Stack = createNativeStackNavigator<RoutingParams>();

export function MainStack() {
  return (
    <Stack.Navigator>
      {/* The root screen is the bottom tab navigator */}
      <Stack.Screen
        name="root"
        component={ BottomTabNavigator }
        options={ {
          headerShown: false, 
          headerTitle: '', 
        } } />

      {/* bookmarks */}
      <Stack.Screen 
        name={ 'bookmarks' }
        component={ BookmarksScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: strings.bookmarks,
        } } />

      {/* search */}
      <Stack.Screen
        name={ 'search' }
        component={ SearchScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: strings.search,
        } } />
        
      {/* achievement screens */}
      <Stack.Screen
        name={ 'achievement' }
        component={ AchievementScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: '',
        } } />
      <Stack.Screen
        name={ 'achievements' }
        component={ AchievementsScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: strings.achievements,
        } } />

      {/* notification screens */}
      <Stack.Screen
        name={ 'notification' }
        component={ NotificationScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: '',
        } } />
      <Stack.Screen
        name={ 'notifications' }
        component={ NotificationsScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: strings.notifications,
        } } />

      {/* summary screens */}
      <Stack.Screen
        name={ 'summary' }
        component={ SummaryScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: '',
        } } />

      {/* recap screens */}
      <Stack.Screen
        name={ 'recap' }
        component={ RecapScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: '',
        } } />

      {/* category and publisher screens */}
      <Stack.Screen
        name={ 'category' }
        component={ CategoryScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: '',
        } } />
      <Stack.Screen
        name={ 'publisher' }
        component={ PublisherScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: '',
        } } />

      {/* leaderboard screens */}
      <Stack.Screen
        name={ 'leaderboards' }
        component={ LeaderboardsScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: strings.leaderboard,
        } } />

      {/* settings screens */}
      <Stack.Screen
        name='settings'
        component={ SettingsScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null, 
          headerTitle: strings.settings,
        } } />
      <Stack.Screen
        name='account'
        component={ AccountScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null, 
          headerTitle: strings.account,
        } } />
      <Stack.Screen
        name='generalSettings'
        component={ GeneralSettingsScreen }
        options={ {
          headerBackTitle: '',
          headerRight: () => null, 
          headerTitle: strings.settings, 
        } } />
      <Stack.Screen
        name='displayPreferences'
        component={ DisplayPreferencesScreen }
        options={ {
          headerBackTitle: '',
          headerRight: () => null, 
          headerTitle: strings.displayPreferences, 
        } } />
      <Stack.Screen
        name='publisherPicker'
        component={ PublisherPickerScreen }
        options={ {
          headerBackTitle: '',
          headerRight: () => null, 
          headerTitle: strings.publishers, 
        } } />
      <Stack.Screen
        name='categoryPicker'
        component={ CategoryPickerScreen }
        options={ {
          headerBackTitle: '',
          headerRight: () => null, 
          headerTitle: strings.categories, 
        } } />
      <Stack.Screen
        name='notificationSettings'
        component={ NotificationSettingsScreen }
        options={ {
          headerBackTitle: '',
          headerRight: () => null, 
          headerTitle: strings.notifications, 
        } } />
      <Stack.Screen
        name='colorSchemePicker'
        component={ ColorSchemePickerScreen }
        options={ {
          headerBackTitle: '',
          headerRight: () => null, 
          headerTitle: strings.colorScheme, 
        } } />
      <Stack.Screen
        name='fontPicker'
        component={ FontPickerScreen }
        options={ {
          headerBackTitle: '',
          headerRight: () => null, 
          headerTitle: strings.font, 
        } } />
      <Stack.Screen
        name='shortPressFormatPicker'
        component={ ShortPressFormatPickerScreen }
        options={ {
          headerBackTitle: '',
          headerRight: () => null, 
          headerTitle: strings.shortPressToQuickView, 
        } } />
      <Stack.Screen
        name='readingFormatPicker'
        component={ ReadingFormatPickerScreen }
        options={ {
          headerBackTitle: '',
          headerRight: () => null, 
          headerTitle: strings.preferredReadingFormat, 
        } } />

      {/* misc screens */}
      <Stack.Screen
        name={ 'stats' }
        component={ StatsScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: 'stats',
        } } />
      <Stack.Screen
        name={ 'test' }
        component={ TestScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: 'test',
        } } />
      <Stack.Screen
        name='legal'
        component={ LegalScreen }
        options={ {
          headerBackTitle: '',
          headerRight: () => null, 
          headerTitle: strings.legal, 
        } } />
    </Stack.Navigator>
  );
}