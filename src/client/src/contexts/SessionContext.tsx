import React from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "react-router-dom";
import { PaletteMode, Theme, useMediaQuery } from "@mui/material";
import { ConsumptionMode } from "@/components/Post";

import { loadTheme } from "@/theme";

export type Preferences = {
  displayMode?: PaletteMode;
  consumptionMode?: ConsumptionMode;
};

export type SetSearchTextOptions = {
  clearSearchParams?: boolean;
};

export type Session = {
  theme: Theme;
  preferences: Preferences;
  displayMode?: PaletteMode;
  consumptionMode?: ConsumptionMode;
  searchText: string;
  searchOptions: string[];
  setDisplayMode: React.Dispatch<React.SetStateAction<PaletteMode | undefined>>;
  setConsumptionMode: React.Dispatch<
    React.SetStateAction<ConsumptionMode | undefined>
  >;
  setSearchText: (
    state: React.SetStateAction<string>,
    opts?: SetSearchTextOptions
  ) => void;
  setSearchOptions: React.Dispatch<React.SetStateAction<string[]>>;
};

type Props = React.PropsWithChildren<{}>;

export const NULL_SESSION: Session = {
  theme: loadTheme(),
  preferences: {},
  displayMode: "light",
  consumptionMode: "concise",
  searchText: "",
  searchOptions: [],
  setDisplayMode: () => {},
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
  const [_, setSearchParams] = useSearchParams();
  const isDarkModeEnabled = useMediaQuery("(prefers-color-scheme: dark)");

  const [theme, setTheme] = React.useState(
    loadTheme(isDarkModeEnabled ? "dark" : "light")
  );
  const [preferences, setPreferences] = React.useState<Preferences>({});

  const { displayMode, consumptionMode } = React.useMemo(
    () => preferences,
    [preferences]
  );
  const [searchText, setSearchText] = React.useState("");
  const [searchOptions, setSearchOptions] = React.useState<string[]>([]);

  // Convenience function to set a preference
  const preferenceSetter =
    <Key extends keyof Preferences>(key: Key) =>
    (
      value?: Preferences[Key] | ((prev: Preferences[Key]) => Preferences[Key])
    ) => {
      setPreferences((preferences) => {
        const newPrefs = {
          ...preferences,
        };
        if (!value) {
          delete newPrefs[key];
        } else {
          newPrefs[key] =
            value instanceof Function ? value(preferences[key]) : value;
        }
        return (preferences = newPrefs);
      });
    };

  const { setDisplayMode, setConsumptionMode } = React.useMemo(() => {
    return {
      setDisplayMode: preferenceSetter("displayMode"),
      setConsumptionMode: preferenceSetter("consumptionMode"),
    };
  }, [preferenceSetter]);

  // Load cookies on mount
  React.useEffect(() => {
    try {
      const prefs = JSON.parse(Cookies.get(COOKIES.preferences) || "{}");
      setPreferences(prefs);
    } catch (e) {
      console.error(e);
      setPreferences({});
    }
  }, []);

  // Update theme when user preference changes
  React.useEffect(() => {
    setTheme(loadTheme(displayMode ?? (isDarkModeEnabled ? "dark" : "light")));
  }, [displayMode, isDarkModeEnabled]);

  // Save preferences as cookie when they change
  React.useEffect(() => {
    Cookies.set(COOKIES.preferences, JSON.stringify(preferences), {
      path: "/",
      expires: DEFAULT_SESSION_DURATION,
    });
  }, [preferences]);

  return (
    <SessionContext.Provider
      value={{
        theme,
        preferences,
        displayMode,
        consumptionMode,
        searchText,
        searchOptions,
        setDisplayMode,
        setConsumptionMode,
        setSearchText: (
          state,
          { clearSearchParams }: SetSearchTextOptions = {}
        ) => {
          setSearchText(state);
          if (clearSearchParams) {
            setSearchParams({});
          }
        },
        setSearchOptions,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
