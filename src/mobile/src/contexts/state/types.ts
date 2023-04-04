import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { LoginDialogProps } from '~/components';

export type AppStateContextType = {
  screenOptions: BottomTabNavigationOptions;
  setScreenOptions: React.Dispatch<React.SetStateAction<BottomTabNavigationOptions>>;
  showLoginDialog?: boolean;
  setShowLoginDialog: React.Dispatch<React.SetStateAction<boolean>>;
  loginDialogProps?: LoginDialogProps;
  setLoginDialogProps: React.Dispatch<React.SetStateAction<LoginDialogProps | undefined>>;
  deferredAction?: () => void;
  setDeferredAction: React.Dispatch<React.SetStateAction<(() => void) | undefined>>;
};

export const DEFAULT_APP_STATE_CONTEXT: AppStateContextType = {
  screenOptions: { headerShown: true },
  setDeferredAction: () => {
    /** placeholder */
  },
  setLoginDialogProps: () => {
    /** placeholder */
  },
  setScreenOptions: () => {
    /** placeholder */
  },
  setShowLoginDialog: () => {
    /** placeholder */
  },
  showLoginDialog: false,
};