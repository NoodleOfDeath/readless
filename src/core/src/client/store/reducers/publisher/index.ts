import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { StoreState } from '../../types';

export type PublisherSliceState = Pick<StoreState, 'excludedPublishers' | 'favoritedPublishers' | 'followedPublishers'>;

const publisherSlice = createSlice({
  initialState: null as PublisherSliceState | null,
  name: 'publisher',
  reducers: { 
    setExcludedPublishers: (state, action: PayloadAction<PublisherSliceState>) => {
      if (state) {
        state.excludedPublishers = action.payload.excludedPublishers;
      }
    },
    setFavoritedPublishers: (state, action: PayloadAction<PublisherSliceState>) => {
      if (state) {
        state.favoritedPublishers = action.payload.favoritedPublishers;
      }
    },
    setFollowedPublishers: (state, action: PayloadAction<PublisherSliceState>) => {
      if (state) {
        state.followedPublishers = action.payload.followedPublishers;
      }
    },
  },
});

export const { 
  setExcludedPublishers,
  setFavoritedPublishers,
  setFollowedPublishers,
} = publisherSlice.actions;

export default publisherSlice.reducer;