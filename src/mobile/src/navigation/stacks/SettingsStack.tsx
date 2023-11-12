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
      headerRight: () => null, 
      headerTitle: strings.screens, 
    },
  },
  {
    component: PublisherPickerScreen,
    name: 'publisherPicker',
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.screens, 
    },
  },
  {
    component: CategoryPickerScreen,
    name: 'categoryPicker',
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.screens, 
    },
  },
  {
    component: NotificationSettingsScreen,
    name: 'notifications',
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.screens, 
    },
  },
  {
    component: ColorSchemePickerScreen, 
    name: 'colorSchemePicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.screens, 
    },
  },
  {
    component: FontPickerScreen,
    name: 'fontPicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.screens, 
    },
  },
  {
    component: ShortPressFormatPickerScreen,
    name: 'shortPressFormatPicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.screens, 
    },
  },
  {
    component: ReadingFormatPickerScreen,
    name: 'readingFormatPicker',  
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.screens, 
    },
  },
  {
    component: TriggerWordPickerScreen,
    name: 'triggerWordPicker',  
    options: {
      headerRight: () => null, 
      headerTitle: strings.screens, 
    },
  },
  {
    component: LegalScreen, 
    name: 'legal', 
    options: {
      headerBackTitle: '',
      headerRight: () => null, 
      headerTitle: strings.screens, 
    },
  },
];