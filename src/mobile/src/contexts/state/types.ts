import { LoginDialogProps } from '~/components';

export type AppStateContextType = {
  showLoginDialog?: boolean;
  setShowLoginDialog: React.Dispatch<React.SetStateAction<boolean>>;
  loginDialogProps?: LoginDialogProps;
  setLoginDialogProps: React.Dispatch<React.SetStateAction<LoginDialogProps | undefined>>;
  deferredAction?: () => void;
  setDeferredAction: React.Dispatch<React.SetStateAction<(() => void) | undefined>>;
};

export const DEFAULT_APP_STATE_CONTEXT: AppStateContextType = {
  setDeferredAction: () => {
    /** placeholder */
  },
  setLoginDialogProps: () => {
    /** placeholder */
  },
  setShowLoginDialog: () => {
    /** placeholder */
  },
  showLoginDialog: false,
};