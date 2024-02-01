import { combineReducers, configureStore } from '@reduxjs/toolkit';

import categorySlice from './reducers/category';
import preferenceSlice from './reducers/preference';
import publisherSlice from './reducers/publisher';
import summarySlice from './reducers/summary';
import userSlice from './reducers/user';

// test kernels with HSM
// consolidate the shadows
// test inadvertent 
// setuid files

// test firewall enabled
// look at ports blocked
// 

const store = configureStore({ 
  preloadedState: {},
  reducer: combineReducers({
    category: categorySlice,
    preference: preferenceSlice,
    publisher: publisherSlice,
    summary: summarySlice,
    user: userSlice,
  }),
});

export * from './reducers';

export default store;