import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { StoreState } from '../../types';

export type PublisherSliceState = Pick<StoreState, 'excludedPublishers' | 'favoritedPublishers' | 'followedPublishers'>;

const initialState: PublisherSliceState = {
  excludedPublishers: {},
  favoritedPublishers: {},
  followedPublishers: {},
};

export { initialState as publisherInitialState };

export const publisherSlice = createSlice({
  initialState,
  name: 'publisher',
  reducers: { 
    setExcludedPublishers: (state, action: PayloadAction<StoreState['excludedPublishers']>) => {
      if (state) {
        state.excludedPublishers = action.payload;
      }
    },
    setFavoritedPublishers: (state, action: PayloadAction<StoreState['favoritedPublishers']>) => {
      if (state) {
        state.favoritedPublishers = action.payload;
      }
    },
    setFollowedPublishers: (state, action: PayloadAction<StoreState['followedPublishers']>) => {
      if (state) {
        state.followedPublishers = action.payload;
      }
    },
  },
});

export const { 
  setExcludedPublishers,
  setFavoritedPublishers,
  setFollowedPublishers,
} = publisherSlice.actions;
