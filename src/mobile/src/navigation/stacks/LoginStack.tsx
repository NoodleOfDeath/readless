import {
  EventMapBase,
  NavigationState,
  RouteConfig,
} from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { strings } from '~/locales';
import {
  ForgotPasswordScreen,
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
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: strings.login,
    },
  },
  {
    component: PasswordLoginScreen,
    name: 'passwordLogin',
    options: {
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: strings.login,
    },
  },
  {
    component: RegisterScreen,
    name: 'register',
    options: {
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: strings.register,
    },
  },
  {
    component: ForgotPasswordScreen,
    name: 'forgotPassword',
    options: {
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: strings.forgotPassword,
    },
  },
];