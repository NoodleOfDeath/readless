import React from 'react';

import 'react-native-get-random-values';

import { Portal } from 'react-native-paper';
import { v4 as uuid } from 'uuid';

import { DEFAULT_TOAST_CONTEXT } from './types';

import {
  Text,
  Toast,
  ToastProps,
  View,
} from '~/components';
import { strings } from '~/locales';

export const ToastContext = React.createContext(DEFAULT_TOAST_CONTEXT);

export function ToastContextProvider({ children }: React.PropsWithChildren) {

  const [toastMap, setToastMap] = React.useState<{ [key in string]: ToastProps }>({});
  
  const toasts = React.useMemo(() => Object.values(toastMap).filter(Boolean).sort((a, b) => (a.createdAt.valueOf() - b.createdAt.valueOf()) + ((a.duration ?? 0) - (b.duration ?? 0))), [toastMap]);

  const showToast = React.useCallback((props: string | ToastProps) => {
    let computedProps: ToastProps;
    if (typeof props === 'string') {
      computedProps = { 
        action: { label: strings.ok },
        children: (
          <View flex={ 1 }>
            <Text>{props}</Text>
          </View>
        ),
        createdAt: new Date(),
        id: uuid(),
      };
    } else {
      computedProps = props;
    }
    const {
      id = uuid(),
      createdAt = new Date(),
      ...toast
    } = computedProps;
    setToastMap((prev) => ({
      ...prev,
      [id]: {
        createdAt, 
        id,
        ...toast, 
      },
    }));
  }, []);

  const hideToast = React.useCallback((id: string) => {
    setToastMap((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  }, []);

  return (
    <ToastContext.Provider
      value={ {
        hideToast,
        showToast,
      } }>
      {children}
      <Portal>
        {toasts.map((toast, index) => (
          <Toast
            { ...toast }
            key={ toast.id }
            mb={ 16 + (index * 64) }
            onDismiss={ () => toast.onDismiss ? toast.onDismiss() : hideToast(toast.id) } />
        ))}
      </Portal>
    </ToastContext.Provider>
  );
}
