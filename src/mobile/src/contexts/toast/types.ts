import React from 'react';

export type ToastContextType = {
  alert: (content: React.ReactNode, duration?: number) => void;
};

export const DEFAULT_TOAST_CONTEXT: ToastContextType = {
  alert: () => {
    /** placeholder */
  },
};