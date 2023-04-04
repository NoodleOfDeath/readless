import React from 'react';

import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { DEFAULT_APP_STATE_CONTEXT } from './types';

import {
  LoginAction,
  LoginDialog,
  LoginDialogProps,
} from '~/components';
import { SessionContext } from '~/core/contexts';
import { ReleaseNotesScreen } from '~/screens';

export const AppStateContext = React.createContext(DEFAULT_APP_STATE_CONTEXT);

export function AppStateContextProvider({ children }: React.PropsWithChildren) {

  const { preferences: { lastReleaseNotesDate }, setPreference } = React.useContext(SessionContext);

  const [screenOptions, setScreenOptions] =
    React.useState<BottomTabNavigationOptions>({});
  const [showLoginDialog, setShowLoginDialog] = React.useState<boolean>(false);
  const [loginDialogProps, setLoginDialogProps] = React.useState<LoginDialogProps>();
  const [deferredAction, setDeferredAction] = React.useState<() => void>();

  const [showReleaseNotes, setShowReleaseNotes] = React.useState<boolean>(false);

  const handleLoginSuccess = React.useCallback((action: LoginAction) => {
    if (action === 'logIn') {
      setShowLoginDialog(false);
    }
  }, []);
  
  React.useEffect(() => {
    if (!showLoginDialog) {
      setLoginDialogProps(undefined);
    }
  }, [showLoginDialog]);

  React.useEffect(() => {
    if (new Date(lastReleaseNotesDate) < new Date()) {
      setShowReleaseNotes(true);
      setPreference('lastReleaseNotesDate', new Date().valueOf().toString());
    }
  }, [lastReleaseNotesDate, setPreference]);
  
  return (
    <AppStateContext.Provider value={ {
      deferredAction,
      loginDialogProps,
      screenOptions,
      setDeferredAction,
      setLoginDialogProps,
      setScreenOptions,
      setShowLoginDialog,
      showLoginDialog,
    } }>
      {children}
      {showReleaseNotes && <ReleaseNotesScreen />}
      <LoginDialog 
        visible={ showLoginDialog }
        onClose={ () => setShowLoginDialog(false) }
        onSuccess={ (action) => handleLoginSuccess(action) }
        { ...loginDialogProps } />
    </AppStateContext.Provider>
  );
}
