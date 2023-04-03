import { Theme } from '@emotion/react';

// Context

export type SetSessionOptions = {
  updateCookie?: boolean;
};

export type SetSearchTextOptions = {
  clearSearchParams?: boolean;
};

export type AppStateContext = {
  theme: Theme;
  // app ui state
  showLoginDialog: boolean;
  setShowLoginDialog: (state: React.SetStateAction<boolean>, deferredAction?: () => void) => void;
  // search text
  searchText: string;
  setSearchText: (
    state: React.SetStateAction<string>,
    opts?: SetSearchTextOptions
  ) => void;
  searchOptions: string[];
  setSearchOptions: React.Dispatch<React.SetStateAction<string[]>>;
};

export const NULL_SESSION: Session = {
  searchOptions: [],
  searchText: '',
  setSearchOptions: () => {
    /* placeholder function */
  },
  setSearchText: () => {
    /* placeholder function */
  },
  setShowLoginDialog: () => {
    /* placeholder function */
  },
  showLoginDialog: false,
  theme: loadTheme(),
};