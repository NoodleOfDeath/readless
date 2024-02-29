import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

const Stack = createNativeStackNavigator<RoutingParams>();

export function LoginStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='login'
        component={ LoginScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerShown: false,
          headerTitle: '',
        } } />
      <Stack.Screen
        name='passwordLogin'
        component={ PasswordLoginScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: strings.login,
        } } />
      <Stack.Screen
        name='register'
        component={ RegisterScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: strings.register,
        } } />
      <Stack.Screen
        name='forgotPassword'
        component={ ForgotPasswordScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: strings.forgotPassword,
        } } />
      <Stack.Screen
        name='verifyOtp'
        component={ VerifyOtpScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: strings.verify,
        } } />
      <Stack.Screen
        name='setNewPassword'
        component={ SetNewPasswordScreen }
        options={ {
          headerBackTitle: '',
          headerLeft: () => null,
          headerRight: () => null,
          headerTitle: strings.forgotPassword,
        } } />
    </Stack.Navigator>
  );
}