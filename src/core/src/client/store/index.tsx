import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  categoryInitialState,
  categorySlice,
  preferenceInitialState,
  preferenceSlice,
  publisherInitialState,
  publisherSlice,
  summaryInitialState,
  summarySlice,
} from './reducers';

// test kernels with HSM
// consolidate the shadows
// test inadvertent 
// setuid files

// test firewall enabled
// look at ports blocked
// 

const store = configureStore({ 
  preloadedState: { 
    category: categoryInitialState,
    preference: preferenceInitialState,
    publisher: publisherInitialState,
    summary: summaryInitialState,
  },
  reducer: combineReducers({
    category: categorySlice.reducer,
    preference: preferenceSlice.reducer,
    publisher: publisherSlice.reducer,
    summary: summarySlice.reducer,
  }),
});

export * from './reducers';

export default store;