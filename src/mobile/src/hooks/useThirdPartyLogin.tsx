import React from 'react';
import { Alert, Platform } from 'react-native';

import { GOOGLE_CLIENT_ID, REGISTRATION_PRIVATE_KEY } from '@env';
import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { GoogleSignin, User as GoogleUser } from '@react-native-google-signin/google-signin';
import CryptoJS from 'react-native-crypto-js';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

import { ThirdParty } from '~/api';
import {
  StorageContext,
  ToastContext,
  UserData,
} from '~/contexts';
import { strings } from '~/locales';

GoogleSignin.configure({ webClientId: GOOGLE_CLIENT_ID });

const authWithApple = async () => {
  if (Platform.OS === 'ios') {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
    return credentialState === appleAuth.State.AUTHORIZED ? appleAuthRequestResponse.identityToken : undefined;
  } else
  if (Platform.OS === 'android') {
    appleAuthAndroid.configure({
      clientId: 'ai.readless.readless.apple-sign-in',
      nonce: uuid(),
      redirectUri: 'https://api.readless.ai/auth/apple',
      responseType: appleAuthAndroid.ResponseType.ALL,
      scope: appleAuthAndroid.Scope.ALL,
      state: uuid(),
    });
    const response = await appleAuthAndroid.signIn();
    return response.id_token;
  }
};

const authWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  const user = await GoogleSignin.signIn();
  const { idToken } = user as GoogleUser;
  return idToken;
};

export function useThirdPartyLogin(callback?: React.Dispatch<React.SetStateAction<string | undefined>>) {
  
  const {
    api: {
      login, 
      registerAlias, 
      unregisterAlias,
      deleteUser,
    },
    userData,
    setStoredValue, 
    syncWithRemotePrefs,
    resetStorage,
  } = React.useContext(StorageContext);
  const { showToast } = React.useContext(ToastContext);

  const signInWithApple = React.useCallback(async () => {
    try {
      const identityToken = await authWithApple();
      if (!identityToken) {
        throw new Error(strings.failedToSignInWithApple);
      }
      const { data: response, error } = await login({
        createIfNotExists: true, 
        thirdParty: {
          credential: identityToken ?? undefined, 
          name: ThirdParty.Apple, 
        },
      });
      if (error) {
        throw error;
      }
      const userData = new UserData(response);
      setStoredValue('userData', userData);
      syncWithRemotePrefs(userData);
    } catch (e) {
      const error = e as Error;
      console.error(error);
      callback?.([strings.failedToSignInWithApple, error.message].join('\n'));
    }
  }, [login, setStoredValue, syncWithRemotePrefs, callback]);
  
  const signInWithGoogle = React.useCallback(async () => {
    try {
      const idToken = await authWithGoogle();
      if (!idToken) {
        throw new Error(strings.failedToSignInWithGoogle);
      }
      const { data: response, error } = await login({
        createIfNotExists: true, 
        thirdParty: {
          credential: idToken, 
          name: ThirdParty.Google, 
        },
      });
      if (error) {
        throw error;
      }
      const userData = new UserData(response);
      setStoredValue('userData', userData);
      syncWithRemotePrefs(userData);
      callback?.(undefined);
    } catch (e) {
      const error = e as Error;
      console.error(error);
      callback?.([strings.failedToSignInWithGoogle, error.message].join('\n'));
    }
  }, [login, setStoredValue, syncWithRemotePrefs, callback]);

  const signInWithoutAccount = React.useCallback(async () => {
    try {
      const anonymous = CryptoJS.AES.encrypt(JSON.stringify({ timestamp: new Date().toISOString() }), REGISTRATION_PRIVATE_KEY).toString();
      const { data: response, error } = await login({
        anonymous,
        createIfNotExists: true,
      });
      if (error) {
        throw error;
      }
      const userData = new UserData(response);
      setStoredValue('userData', userData);
      syncWithRemotePrefs(userData);
      callback?.(undefined);
    } catch (error) {
      console.error(error);
      callback?.(['Failed to continue without an account:', error].join(' '));
    }
  }, [login, setStoredValue, syncWithRemotePrefs, callback]);
  
  const registerEmail = React.useCallback(async (email: string) => {
    await registerAlias({ otherAlias: { email } });
  }, [registerAlias]);
  
  const unregisterEmail = React.useCallback(async (email: string) => {
    if ((userData?.profile?.emails?.length ?? 0) <= 1) {
      return;
    }
    await unregisterAlias({ otherAlias: { email } });
  }, [unregisterAlias, userData]);
  
  const linkThirdPartyAccount = React.useCallback(async (thirdParty: ThirdParty) => {
    let token = '';
    if (thirdParty === ThirdParty.Apple) {
      token = await authWithApple() ?? '';
    } else
    if (thirdParty === ThirdParty.Google) {
      token = await authWithGoogle() || '';
    } else {
      throw new Error('Unknown third party');
    }
    const { error } = await registerAlias({ 
      otherAlias: { 
        thirdParty: {
          credential: token,
          name: thirdParty,
        },
      },
    });
    if (error) {
      throw error;
    }
    setStoredValue('userData', (prev) => {
      const state = { ...prev };
      state.profile = {
        ...state.profile,
        linkedThirdPartyAccounts: [
          ...(state.profile?.linkedThirdPartyAccounts ?? []),
          thirdParty,
        ],
      };
      return new UserData(state);
    }, false);
  }, [registerAlias, setStoredValue]);
  
  const unlinkThirdPartyAccount = React.useCallback(async (thirdParty: ThirdParty) => {
    
    const unlink = async () => {
      await unregisterAlias({ otherAlias: { thirdParty } });
      setStoredValue('userData', (prev) => {
        const state = { ...prev };
        const accounts = Object.fromEntries((state.profile?.linkedThirdPartyAccounts ?? []).map((k) => [k, null]));
        delete accounts[thirdParty];
        state.profile = {
          ...state.profile,
          linkedThirdPartyAccounts: Object.keys(accounts) as ThirdParty[],
        };
        return new UserData(state);
      }, false);
    };
    
    if (userData?.unlinked) {
      Alert.alert(
        strings.accountIsNotLinkedToAnEmail, 
        strings.ifYouSignOutYouWillNotBeAbleToRecover,
        [
          {
            style: 'cancel',
            text: strings.cancel,
          },
          {
            onPress: () => unlink(), 
            text: strings.yesUnlink,
          },
        ]
      );
    } else {
      Alert.alert(
        strings.unlinkThirdPartyAccount, 
        strings.areYouSureYouWantToUnlinkThisAccount,
        [
          {
            style: 'cancel',
            text: strings.cancel,
          },
          {
            onPress: () => unlink(), 
            text: strings.yesUnlink,
          },
        ]
      );
    }
    
  }, [unregisterAlias, setStoredValue, userData]);

  const deleteAccount = React.useCallback(async () => {
    Alert.prompt(
      strings.deleteAccount,
      strings.areYouSureYouWantToDeleteYourAccount,
      async (password) => {
        try {
          const { error } = await deleteUser({
            password,
            userId: userData?.userId,
          });
          if (error) {
            throw error;
          }
          resetStorage(true);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          if (e) {
            console.error(e);
            showToast(e?.errorKey ?? e.message);
          } else {
            resetStorage(true);
          }
        }
      },
      'secure-text'
    );
  }, [deleteUser, resetStorage, showToast, userData?.userId]);
  
  return {
    deleteAccount,
    linkThirdPartyAccount,
    registerEmail,
    signInWithApple,
    signInWithGoogle,
    signInWithoutAccount,
    unlinkThirdPartyAccount,
    unregisterEmail,
  };
  
}