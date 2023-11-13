import EventEmitter from 'events';

import React from 'react';

import {
  StorageEventName,
  StorageMutation,
  StorageState,
} from '~/contexts';

export function usePlatformTools() {

  const [navigator, setNavigator] = React.useState<Navigator>();

  const getUserAgent = React.useCallback(() => {
    return {
      OS: 'web',
      currentVersion: 'web1.17.0',
      locale: navigator?.language ?? 'unknown',
      userAgent: navigator?.userAgent ?? 'unknown',
    };
  }, [navigator]);

  const emitEvent = <E extends StorageEventName>(event: E, mutation?: StorageMutation<E>, state?: StorageState<E>) => {
    new EventEmitter().emit(event, mutation, state);
  };

  React.useEffect(() => {
    setNavigator(window.navigator);
  }, []);

  return {
    emitEvent,
    getUserAgent,
  };

}