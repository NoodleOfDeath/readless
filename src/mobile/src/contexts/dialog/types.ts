import React from 'react';

import { PublicSummaryAttributes } from '~/api';

export type DialogContextType = {
  shareTarget?: PublicSummaryAttributes;
  setShareTarget: React.Dispatch<React.SetStateAction<PublicSummaryAttributes | undefined>>;
};

export const DEFAULT_DIALOG_CONTEXT: DialogContextType = {
  setShareTarget: () => {
    // placeholder
  },
};