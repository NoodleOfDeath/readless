import { Theme } from '@mui/material';

import { loadTheme } from '~/theme';

export type DialogContextType = {
  deferredAction?: () => void;
  setDeferredAction: React.Dispatch<React.SetStateAction<(() => void | undefined) | undefined>>;
  setShowLoginDialog: React.Dispatch<React.SetStateAction<boolean>>;
  showLoginDialog: boolean;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchSuggestions: string[];
  setSearchSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  theme: Theme;
};

export const DEFAULT_DIALOG_CONTEXT: DialogContextType = {
  searchSuggestions: [],
  searchText: '',
  setDeferredAction: () => {
    /** placeholder */
  },
  setSearchSuggestions: () => {
    /** placeholder */
  },
  setSearchText: () => {
    /** placeholder */
  },
  setShowLoginDialog: () => {
    /** placeholder */
  },
  showLoginDialog: false,
  theme: loadTheme('light'),
};
