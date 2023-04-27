
import { FeedBackDialogProps, ShareFabProps } from '~/components';

export type DialogContextType = {
  setShowFeedbackDialog: (state: boolean | ((prev: boolean) => boolean), options?: FeedBackDialogProps) => void; 
  showFeedbackDialog: boolean;
  setShowShareFab: (state: boolean | ((prev: boolean) => boolean), options?: ShareFabProps) => void;
  showShareFab: boolean;
};

export const DEFAULT_DIALOG_CONTEXT: DialogContextType = {
  setShowFeedbackDialog: () => {
    /** placeholder */
  },
  setShowShareFab: () => {
    /** placeholder */
  },
  showFeedbackDialog: false,
  showShareFab: false,
};