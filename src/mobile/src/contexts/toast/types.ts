import { ToastProps } from '~/components';

export type ToastContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showToast: (props: ToastProps | any) => void;
  hideToast: (id: string) => void;
};

export const DEFAULT_TOAST_CONTEXT: ToastContextType = { 
  hideToast: () => Promise.resolve(),
  showToast: () => Promise.resolve(),
};