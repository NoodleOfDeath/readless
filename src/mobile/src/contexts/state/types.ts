import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PublicSummaryAttributes } from '~/api';
import { LoginDialogProps } from '~/components';
import { StackableTabParams } from '~/screens';

export type AppStateContextType = {
  showLoginDialog?: boolean;
  setShowLoginDialog: React.Dispatch<React.SetStateAction<boolean>>;
  loginDialogProps?: LoginDialogProps;
  setLoginDialogProps: React.Dispatch<React.SetStateAction<LoginDialogProps | undefined>>;
  showNotFollowingDialog?: boolean;
  setShowNotFollowingDialog: React.Dispatch<React.SetStateAction<boolean>>;
  showFeedbackDialog?: boolean;
  setShowFeedbackDialog: React.Dispatch<React.SetStateAction<boolean>>;
  feedbackSubject?: PublicSummaryAttributes;
  setFeedbackSubject: React.Dispatch<React.SetStateAction<PublicSummaryAttributes | undefined>>;
  deferredAction?: () => void;
  setDeferredAction: React.Dispatch<React.SetStateAction<(() => void) | undefined>>;
  navigation?: NativeStackNavigationProp<StackableTabParams, keyof StackableTabParams>;
  setNavigation: React.Dispatch<React.SetStateAction<NativeStackNavigationProp<StackableTabParams, keyof StackableTabParams> | undefined>>;
};

export const DEFAULT_APP_STATE_CONTEXT: AppStateContextType = {
  feedbackSubject: undefined,
  setDeferredAction: () => {
    /** placeholder */
  },
  setFeedbackSubject: () => {
    /** placeholder */
  },
  setLoginDialogProps: () => {
    /** placeholder */
  },
  setNavigation: () => {
    /** placeholder */
  },
  setShowFeedbackDialog: () => {
    /** placeholder */
  },
  setShowLoginDialog: () => {
    /** placeholder */
  },
  setShowNotFollowingDialog: () => {
    /** placeholder */
  },
  showFeedbackDialog: false,
  showLoginDialog: false,
  showNotFollowingDialog: false,
};