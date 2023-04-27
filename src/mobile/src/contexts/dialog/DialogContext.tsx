import React from 'react';

import { Portal, Provider } from 'react-native-paper';

import { DEFAULT_DIALOG_CONTEXT } from './types';

import {
  FeedBackDialog,
  FeedBackDialogProps,
  ShareFab,
  ShareFabProps,
} from '~/components';
import { useSummaryClient } from '~/hooks';

export const DialogContext = React.createContext(DEFAULT_DIALOG_CONTEXT);

export function DialogContextProvider({ children }: React.PropsWithChildren) {

  const { handleInteraction } = useSummaryClient();

  const [showShareFab, setShowShareFabRaw] = React.useState<boolean>(false);
  const [shareFabOptions, setShareFabOptions] = React.useState<ShareFabProps>();
  const [showFeedbackDialog, setShowFeedbackDialogRaw] = React.useState<boolean>(false);
  const [feedbackOptions, setFeedbackOptions] = React.useState<FeedBackDialogProps>();

  const setShowShareFab = React.useCallback((state: boolean | ((prev: boolean) => boolean), options?: ShareFabProps) => {
    setShowShareFabRaw(state);
    setShareFabOptions(options);
  }, []);

  const setShowFeedbackDialog = React.useCallback((state: boolean | ((prev: boolean) => boolean), options?: FeedBackDialogProps) => {
    setShowFeedbackDialogRaw(state);
    setFeedbackOptions(options);
  }, []);
  
  return (
    <DialogContext.Provider value={ {
      setShowFeedbackDialog,
      setShowShareFab,
      showFeedbackDialog,
      showShareFab,
    } }>
      <Provider>
        {children}
        <Portal>
          <ShareFab
            { ...shareFabOptions }
            open={ showShareFab }
            visible={ showShareFab }
            onInteract={ (...args) => shareFabOptions?.summary && handleInteraction(shareFabOptions.summary, ...args) }
            onDismiss={ () => setShowShareFab(false) } />
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
