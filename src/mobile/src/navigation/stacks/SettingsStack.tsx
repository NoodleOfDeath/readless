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
  FontPickerScreen,
  LegalScreen,
  NotificationSettingsScreen,
  PublisherPickerScreen,
  ReadingFormatPickerScreen,
  RoutingParams,
  SettingsScreen,
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
    component: SettingsScreen, 
    name: 'settings', 
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_settings, 
    },
  },
  {
    component: PublisherPickerScreen,
    name: 'publisherPicker',
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_publishers, 
    },
  },
  {
    component: CategoryPickerScreen,
    name: 'categoryPicker',
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_categories, 
    },
  },
  {
    component: NotificationSettingsScreen,
    name: 'notifications',
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_notifications, 
    },
  },
  {
    component: ColorSchemePickerScreen, 
    name: 'colorSchemePicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_colorScheme, 
    },
  },
  {
    component: FontPickerScreen,
    name: 'fontPicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_font, 
    },
  },
  {
    component: ShortPressFormatPickerScreen,
    name: 'shortPressFormatPicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_preferredShortPressFormat, 
    },
  },
  {
    component: ReadingFormatPickerScreen,
    name: 'readingFormatPicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_preferredReadingFormat, 
    },
  },
  {
    component: TriggerWordPickerScreen,
    name: 'triggerWordPicker',  
    options: {
      headerRight: () => undefined, 
      headerTitle: strings.screens_triggerWords, 
    },
  },
  {
    component: LegalScreen, 
    name: 'legal', 
    options: {
      headerBackTitle: '',
      headerRight: () => undefined, 
      headerTitle: strings.screens_legal, 
    },
  },
];