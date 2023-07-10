import EventEmitter from 'events';

import {
  PreferenceMutation,
  PreferenceState,
  SessionEvent,
} from '~/contexts';

export function getUserAgent() {
  return {
    OS: 'web',
    currentVersion: 'web1.7.10',
    locale: window.navigator.language,
    userAgent: window.navigator.userAgent,
  };
}

export function emitEvent<E extends SessionEvent>(event: E, mutation: PreferenceMutation<E>, state: PreferenceState<E>) {
  new EventEmitter().emit(event, mutation, state);
}