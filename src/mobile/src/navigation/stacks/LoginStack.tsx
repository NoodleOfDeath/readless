import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import {
  LoginScreen,
  PasswordLoginScreen,
  RegisterScreen,
  RoutingParams,
} from '~/screens';

export const LOGIN_STACK: RouteConfig<
  RoutingParams,
  keyof RoutingParams,
  NavigationState,
  NativeStackNavigationOptions,
  EventMapBase
>[] = [
  {
    component: LoginScreen, 
    name: 'login',
    options: {
      headerBackTitle: '',
      headerRight: () => null,
      headerTitle: '', 
    },
  },
  {
    component: PasswordLoginScreen,
    name: 'passwordLogin',
    options: {
      headerBackTitle: '',
      headerTitle: '',
    },
  },
  {
    component: RegisterScreen,
    name: 'register',
    options: {
      headerBackTitle: '',
      headerTitle: '',
    },
  },
];