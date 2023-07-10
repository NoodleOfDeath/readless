import { Theme } from '@mui/material';

import { loadTheme } from '~/theme';

export type DialogContextType = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchSuggestions: string[];
  setSearchSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  theme: Theme;
};

export const DEFAULT_THEME_CONTEXT: DialogContextType = {
  searchSuggestions: [],
  searchText: '',
  setSearchSuggestions: () => Promise.resolve(),
  setSearchText: () => Promise.resolve(),
  theme: loadTheme('light'),
};
