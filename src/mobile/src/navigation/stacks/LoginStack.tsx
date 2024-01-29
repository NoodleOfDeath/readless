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
  SetNewPasswordScreen,
} from '~/screens';
import { VerifyOtpScreen } from '~/screens/login/VerifyOtpScreen';

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
      headerShown: false,
      headerTitle: '',
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
  {
    component: VerifyOtpScreen,
    name: 'verifyOtp',
    options: {
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: strings.verify,
    },
  },
  {
    component: SetNewPasswordScreen,
    name: 'setNewPassword',
    options: {
      headerBackTitle: '',
      headerLeft: () => null,
      headerRight: () => null,
      headerTitle: strings.forgotPassword,
    },
  },
  
];

export const LOGIN_STACK_KEYS = LOGIN_STACK.map(({ name }) => name);