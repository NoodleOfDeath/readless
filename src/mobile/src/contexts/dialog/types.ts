
import {  ReleaseAttributes } from '~/api';
import { FeedBackDialogProps, ShareFabProps } from '~/components';

export type DialogContextType = {
  setShowFeedbackDialog: (state: boolean | ((prev: boolean) => boolean), options?: FeedBackDialogProps) => void; 
  showFeedbackDialog: boolean;
  setShowShareFab: (state: boolean | ((prev: boolean) => boolean), options?: ShareFabProps) => void;
  showShareFab: boolean;
  setShowReleaseNotes: (state: boolean | ((prev: boolean) => boolean), notes: ReleaseAttributes[]) => void;
  showReleaseNotes: boolean;
};

export const DEFAULT_DIALOG_CONTEXT: DialogContextType = {
  setShowFeedbackDialog: () => {
    /** placeholder */
  },
  setShowReleaseNotes: () => {
    /** placeholder */
  },
  setShowShareFab: () => {
    /** placeholder */
  },
  showFeedbackDialog: false,
  showReleaseNotes: false,
  showShareFab: false,
};