import EventEmitter from 'events';

import {
  StorageEventName,
  StorageMutation,
  StorageState,
} from '~/contexts';

export function usePlatformTools() {

  const getUserAgent = () => {
    return {
      OS: 'web',
      currentVersion: 'web1.7.10',
      locale: window.navigator.language,
      userAgent: window.navigator.userAgent,
    };
  };

  const emitEvent = <E extends StorageEventName>(event: E, mutation?: StorageMutation<E>, state?: StorageState<E>) => {
    new EventEmitter().emit(event, mutation, state);
  };

  return {
    emitEvent,
    getUserAgent,
  };

}