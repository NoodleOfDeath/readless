import { ToastProps } from '~/components';

export type ToastContextType = {
  showToast: (props: string | ToastProps) => void;
  hideToast: (id: string) => void;
};

export const DEFAULT_TOAST_CONTEXT: ToastContextType = { 
  hideToast: () => Promise.resolve(),
  showToast: () => Promise.resolve(),
};