import React from 'react';

import { Portal, Provider } from 'react-native-paper';

import { DEFAULT_DIALOG_CONTEXT } from './types';

import {
  FeedBackDialog,
  FeedBackDialogProps,
  OnboardingDialog,
  ShareDialog,
  ShareDialogProps,
} from '~/components';
import { useSummaryClient } from '~/hooks';

export const DialogContext = React.createContext(DEFAULT_DIALOG_CONTEXT);

export function DialogContextProvider({ children }: React.PropsWithChildren) {

  const { handleInteraction } = useSummaryClient();

  const [showShareDialog, setShowShareDialogRaw] = React.useState<boolean>(false);
  const [shareFabOptions, setShareDialogOptions] = React.useState<ShareDialogProps>();
  const [showFeedbackDialog, setShowFeedbackDialogRaw] = React.useState<boolean>(false);
  const [feedbackOptions, setFeedbackOptions] = React.useState<FeedBackDialogProps>();

  const setShowShareDialog = React.useCallback((state: boolean | ((prev: boolean) => boolean), options?: ShareDialogProps) => {
    setShowShareDialogRaw(state);
    setShareDialogOptions(options);
  }, []);

  const setShowFeedbackDialog = React.useCallback((state: boolean | ((prev: boolean) => boolean), options?: FeedBackDialogProps) => {
    setShowFeedbackDialogRaw(state);
    setFeedbackOptions(options);
  }, []);
  
  return (
    <DialogContext.Provider value={ {
      setShowFeedbackDialog,
      setShowShareDialog,
      showFeedbackDialog,
      showShareDialog,
    } }>
      <Provider>
        {children}
        <Portal>
          {shareFabOptions?.summary && (
            <ShareDialog
              { ...shareFabOptions }
              open={ showShareDialog }
              visible={ showShareDialog }
              onInteract={ (...args) => handleInteraction(shareFabOptions.summary, ...args) }
              onDismiss={ () => setShowShareDialog(false) } />
          )}
          {feedbackOptions && showFeedbackDialog && (
            <FeedBackDialog
              { ...feedbackOptions }
              visible={ showFeedbackDialog }
              onClose={ () => setShowFeedbackDialog(false) } />
          )}
        </Portal>
      </Provider>
    </DialogContext.Provider>
  );
}
