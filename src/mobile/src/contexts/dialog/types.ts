
import { FeedBackDialogProps, ShareDialogProps } from '~/components';

export type DialogContextType = {
  setShowFeedbackDialog: (state: boolean | ((prev: boolean) => boolean), options?: FeedBackDialogProps) => void; 
  showFeedbackDialog: boolean;
  setShowShareDialog: (state: boolean | ((prev: boolean) => boolean), options?: ShareDialogProps) => void;
  showShareDialog: boolean;
};

export const DEFAULT_DIALOG_CONTEXT: DialogContextType = {
  setShowFeedbackDialog: () => {
    /** placeholder */
  },
  setShowShareDialog: () => {
    /** placeholder */
  },
  showFeedbackDialog: false,
  showShareDialog: false,
};