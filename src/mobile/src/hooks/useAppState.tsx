import React from 'react';
import { AppState, AppStateStatus } from 'react-native';

export interface AppStateHookSettings {
  onChange?: (status: AppStateStatus) => void;
  onForeground?: () => void;
  onBackground?: () => void;
}

export interface AppStateHookResult {
  appState: AppStateStatus;
}

export function useAppState(settings?: AppStateHookSettings) {

  const {
    onChange, onForeground, onBackground, 
  } = settings || {};
  const [appState, setAppState] = React.useState(AppState.currentState);

  React.useEffect(() => {
    const subscriber = AppState.addEventListener('change', (newState: AppStateStatus) => {
      if (newState === 'active' && appState !== 'active') {
        onForeground?.();
      } else if (newState.match(/inactive|background/) && newState !== appState) {
        onBackground?.();
      }
      setAppState(newState);
      onChange?.(newState);
    });
    return () => subscriber.remove();
  }, [onChange, onForeground, onBackground, appState]);

  return { appState };
}