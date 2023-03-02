import React from "react";
import Cookies from "js-cookie";
import { PaletteMode, Theme, useMediaQuery } from "@mui/material";
import { ConsumptionMode } from "@/components/Post";

import { loadTheme } from "@/theme";

export type Preferences = {
  displayMode?: PaletteMode;
  consumptionMode?: ConsumptionMode;
};

export type SearchCache = {
  searchText?: string;
  searchOptions: string[];
};

export type Session = {
  theme: Theme;
  preferences: Preferences;
  searchCache: SearchCache;
  setPreference: (
    key: keyof Preferences,
    value: Preferences[keyof Preferences]
  ) => void;
  setConsumptionMode: (consumptionMode: ConsumptionMode) => void;
  setSearchText: (searchText: string) => void;
  setSearchOptions: (searchOptions: string[]) => void;
};

type Props = React.PropsWithChildren<{}>;

export const NULL_SESSION: Session = {
  theme: loadTheme(),
  preferences: {},
  searchCache: { searchText: "", searchOptions: [] },
  setPreference: () => {},
  setConsumptionMode: () => {},
  setSearchText: () => {},
  setSearchOptions: () => {},
};

export const COOKIES = {
  preferences: "preferences",
};

// 2 days
export const DEFAULT_SESSION_DURATION = 1000 * 60 * 60 * 24 * 2;

export const SessionContext = React.createContext(NULL_SESSION);

export function SessionContextProvider({ children }: Props) {
  const isDarkModeEnabled = useMediaQuery("(prefers-color-scheme: dark)");

  const [theme, setTheme] = React.useState(
    loadTheme(isDarkModeEnabled ? "dark" : "light")
  );
  const [preferences, setPreferences] = React.useState<Preferences>({});
  const [searchCache, setSearchCache] = React.useState<SearchCache>({
    searchText: "",
    searchOptions: [],
  });

  const setPreference = <Key extends keyof Preferences>(
    key: Key,
    value: Preferences[Key]
  ) => {
    setPreferences((preferences) => {
      const newPrefs = {
        ...preferences,
      };
      newPrefs[key] = value;
      return (preferences = newPrefs);
    });
  };

  React.useEffect(() => {
    setPreferences(JSON.parse(Cookies.get(COOKIES.preferences) || "{}"));
  }, []);

  React.useEffect(() => {
    const displayMode =
      preferences.displayMode || (isDarkModeEnabled ? "dark" : "light");
    setTheme(loadTheme(displayMode));
    Cookies.set(COOKIES.preferences, JSON.stringify(preferences), {
      path: "/",
      expires: DEFAULT_SESSION_DURATION,
    });
  }, [isDarkModeEnabled, preferences]);

  return (
    <SessionContext.Provider
      value={{
        theme,
        preferences,
        searchCache: searchCache,
        setPreference,
        setConsumptionMode: (mode) => setPreference("consumptionMode", mode),
        setSearchText: (text) =>
          setSearchCache((prev) => ({ ...prev, searchText: text })),
        setSearchOptions: (options) =>
          setSearchCache((prev) => ({
            ...prev,
            searchOptions: options,
          })),
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
