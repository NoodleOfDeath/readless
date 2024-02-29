import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { StoreState } from '../../types';

export type CategorySliceState = Pick<StoreState, 'excludedCategories' | 'favoritedCategories' | 'followedCategories'>;

const initialState: CategorySliceState = {
  excludedCategories: {},
  favoritedCategories: {},
  followedCategories: {},
};

export { initialState as categoryInitialState };

export const categorySlice = createSlice({
  initialState,
  name: 'category',
  reducers: { 
    setExcludedCategories: (state, action: PayloadAction<StoreState['excludedCategories']>) => {
      if (state) {
        state.excludedCategories = action.payload;
      }
    },
    setFavoritedCategories: (state, action: PayloadAction<StoreState['favoritedCategories']>) => {
      if (state) {
        state.favoritedCategories = action.payload;
      }
    },
    setFollowedCategories: (state, action: PayloadAction<StoreState['followedCategories']>) => {
      if (state) {
        state.followedCategories = action.payload;
      }
    },
  },
});

export const { 
  setExcludedCategories,
  setFavoritedCategories,
  setFollowedCategories,
} = categorySlice.actions;
