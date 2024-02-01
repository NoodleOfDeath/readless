import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { StoreState } from '../../types';

export type CategorySliceState = Pick<StoreState, 'excludedCategories' | 'favoritedCategories' | 'followedCategories'>;

const categorySlice = createSlice({
  initialState: null as CategorySliceState | null,
  name: 'category',
  reducers: { 
    setExcludedCategories: (state, action: PayloadAction<CategorySliceState>) => {
      if (state) {
        state.excludedCategories = action.payload.excludedCategories;
      }
    },
    setFavoritedCategories: (state, action: PayloadAction<CategorySliceState>) => {
      if (state) {
        state.favoritedCategories = action.payload.favoritedCategories;
      }
    },
    setFollowedCategories: (state, action: PayloadAction<CategorySliceState>) => {
      if (state) {
        state.followedCategories = action.payload.followedCategories;
      }
    },
  },
});

export const { 
  setExcludedCategories,
  setFavoritedCategories,
  setFollowedCategories,
} = categorySlice.actions;

export default categorySlice.reducer;