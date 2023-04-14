import React from 'react';

import { Portal } from 'react-native-paper';

import { DEFAULT_TOAST_CONTEXT } from './types';

import { Snackbar, View } from '~/components';
import { SessionContext } from '~/contexts';

export const ToastContext = React.createContext(DEFAULT_TOAST_CONTEXT);

type Props = React.PropsWithChildren;

let n = 0;

type Toast = {
  content: React.ReactNode;
  duration: number;
};

export function ToastContextProvider({ children }: Props) {
  
  const [toasts, setToasts] = React.useState<Record<number, Toast>>({});
  const { preferences: { textScale } } = React.useContext(SessionContext);
  
  const alert = React.useCallback((content: React.ReactNode, duration = 5000) => {
    const id = ++n;
    setToasts((prev) => (prev = { ...prev, [id]: { content, duration } }));
  }, []);
  
  return (
    <ToastContext.Provider value={ { alert } }>
      {children}
      <Portal>
        {Object.entries(toasts).map(([id, toast], i) => (
          <Snackbar 
            key={ id } 
            visible
            duration={ toast.duration }
            style={ { bottom: i * 85 * (textScale * 1) } }
            onDismiss={ () => {
              setToasts((prev) => {
                const state = { ...prev };
                delete state[id];
                return (prev = state);
              });
            } }>
            {toast.content}
          </Snackbar>
        ))}
      </Portal>
    </ToastContext.Provider>
  );
}