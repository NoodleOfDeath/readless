import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { LoginDialogProps } from '~/components';
import { StackableTabParams } from '~/screens';

export type AppStateContextType = {
  showLoginDialog?: boolean;
  setShowLoginDialog: React.Dispatch<React.SetStateAction<boolean>>;
  loginDialogProps?: LoginDialogProps;
  setLoginDialogProps: React.Dispatch<React.SetStateAction<LoginDialogProps | undefined>>;
  showNotFollowingDialog?: boolean;
  setShowNotFollowingDialog: React.Dispatch<React.SetStateAction<boolean>>;
  deferredAction?: () => void;
  setDeferredAction: React.Dispatch<React.SetStateAction<(() => void) | undefined>>;
  navigation?: NativeStackNavigationProp<StackableTabParams, keyof StackableTabParams>;
  setNavigation: React.Dispatch<React.SetStateAction<NativeStackNavigationProp<StackableTabParams, keyof StackableTabParams> | undefined>>;
};

export const DEFAULT_APP_STATE_CONTEXT: AppStateContextType = {
  setDeferredAction: () => {
    /** placeholder */
  },
  setLoginDialogProps: () => {
    /** placeholder */
  },
  setNavigation: () => {
    /** placeholder */
  },
  setShowLoginDialog: () => {
    /** placeholder */
  },
  setShowNotFollowingDialog: () => {
    /** placeholder */
  },
  showLoginDialog: false,
  showNotFollowingDialog: false,
};