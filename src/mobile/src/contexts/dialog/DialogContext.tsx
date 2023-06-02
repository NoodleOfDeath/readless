import React from 'react';

import { SheetProvider, registerSheet } from 'react-native-actions-sheet';
import { Provider } from 'react-native-paper';

import { DEFAULT_DIALOG_CONTEXT } from './types';

import { PublicSummaryAttributes } from '~/api';
import {
  FeedbackDialog,
  ShareDialog,
  SubscribeDialog,
} from '~/components';

export const DialogContext = React.createContext(DEFAULT_DIALOG_CONTEXT);

export function DialogContextProvider({ children }: React.PropsWithChildren) {

  React.useEffect(() => {
    registerSheet('share', ShareDialog);
    registerSheet('feedback', FeedbackDialog);
    registerSheet('subscribe', SubscribeDialog);
  }, []);

  const [shareTarget, setShareTarget] = React.useState<PublicSummaryAttributes>();

  return (
    <DialogContext.Provider value={ {
      setShareTarget,
      shareTarget,
    } }>
      <Provider>
        <SheetProvider>
          {children}
        </SheetProvider>
      </Provider>
    </DialogContext.Provider>
  );
}
