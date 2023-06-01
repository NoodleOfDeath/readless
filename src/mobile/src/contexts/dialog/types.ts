import React from 'react';

import { FeedBackDialogProps, ShareDialogProps } from '~/components';

export type DialogContextType = {
  showShareDialog: boolean;
  setShowShareDialog: (state: boolean | ((prev: boolean) => boolean), options?: ShareDialogProps) => void;
  
  showFeedbackDialog: boolean;
  setShowFeedbackDialog: (state: boolean | ((prev: boolean) => boolean), options?: FeedBackDialogProps) => void; 
  
  showSubscribeDialog: boolean;
  setShowSubscribeDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DEFAULT_DIALOG_CONTEXT: DialogContextType = {
  setShowFeedbackDialog: () => {
    /** placeholder */
  },
  setShowShareDialog: () => {
    /** placeholder */
  },
  setShowSubscribeDialog: () => {
    /** placeholder */
  },
  showFeedbackDialog: false,
  showShareDialog: false,
  showSubscribeDialog: false,
};