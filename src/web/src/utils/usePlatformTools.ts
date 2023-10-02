import EventEmitter from 'events';

import {
  PreferenceMutation,
  PreferenceState,
  SessionEvent,
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

  const emitEvent = <E extends SessionEvent>(event: E, mutation?: PreferenceMutation<E>, state?: PreferenceState<E>) => {
    new EventEmitter().emit(event, mutation, state);
  };

  return {
    emitEvent,
    getUserAgent,
  };

}