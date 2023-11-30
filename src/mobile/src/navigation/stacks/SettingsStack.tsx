import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { strings } from '~/locales';
import {
  CategoryPickerScreen,
  ColorSchemePickerScreen,
  DisplayPreferencesScreen,
  FontPickerScreen,
  GeneralSettingsScreen,
  LegalScreen,
  NotificationSettingsScreen,
  PublisherPickerScreen,
  ReadingFormatPickerScreen,
  RoutingParams,
  ShortPressFormatPickerScreen,
  TriggerWordPickerScreen,
} from '~/screens';

export const SETTINGS_STACK: RouteConfig<
  RoutingParams,
  keyof RoutingParams,
  NavigationState,
  NativeStackNavigationOptions,
  EventMapBase
>[] = [
  {
    component: GeneralSettingsScreen, 
    name: 'generalSettings', 
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.settings, 
    },
  },
  {
    component: DisplayPreferencesScreen, 
    name: 'displayPreferences', 
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.displayPreferences, 
    },
  },
  {
    component: PublisherPickerScreen,
    name: 'publisherPicker',
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.publishers, 
    },
  },
  {
    component: CategoryPickerScreen,
    name: 'categoryPicker',
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.categories, 
    },
  },
  {
    component: NotificationSettingsScreen,
    name: 'notificationSettings',
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.notifications, 
    },
  },
  {
    component: ColorSchemePickerScreen, 
    name: 'colorSchemePicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.colorScheme, 
    },
  },
  {
    component: FontPickerScreen,
    name: 'fontPicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.font, 
    },
  },
  {
    component: ShortPressFormatPickerScreen,
    name: 'shortPressFormatPicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.shortPressToQuickView, 
    },
  },
  {
    component: ReadingFormatPickerScreen,
    name: 'readingFormatPicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.preferredReadingFormat, 
    },
  },
  {
    component: TriggerWordPickerScreen,
    name: 'triggerWordPicker',  
    options: {
      headerRight: () => null, 
      headerTitle: strings.triggerWords, 
    },
  },
  {
    component: LegalScreen, 
    name: 'legal', 
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.legal, 
    },
  },
];