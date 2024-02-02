import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { DatedEvent, StoreState } from '../../types';

import { PublicSummaryAttributes } from '~/api';

export type SummarySliceState = Pick<StoreState, 'bookmarkedSummaries' | 'readSummaries' | 'removedSummaries' | 'saveBookmarksOffline' | 'summaryTranslations'>;

const initialState: SummarySliceState = {
  bookmarkedSummaries: {},
  readSummaries: {},
  removedSummaries: {},
  saveBookmarksOffline: false,
  summaryTranslations: {},
};

export { initialState as summaryInitialState };

export const summarySlice = createSlice({
  initialState,
  name: 'summary',
  reducers: { 
    bookmarkSummary: (state, action: PayloadAction<PublicSummaryAttributes>) => {
      if (state?.bookmarkedSummaries) {
        state.bookmarkedSummaries[action.payload.id] = new DatedEvent(action.payload);
      }
    },
    setBookmarkedSummaries: (state, action: PayloadAction<StoreState['bookmarkedSummaries']>) => {
      if (state) {
        state.bookmarkedSummaries = action.payload;
      }
    },
    setReadSummaries: (state, action: PayloadAction<StoreState['readSummaries']>) => {
      if (state) {
        state.readSummaries = action.payload;
      }
    },
    setRemovedSummaries: (state, action: PayloadAction<StoreState['removedSummaries']>) => {
      if (state) {
        state.removedSummaries = action.payload;
      }
    },
    setSaveBookmarksOffline: (state, action: PayloadAction<StoreState['saveBookmarksOffline']>) => {
      if (state) {
        state.saveBookmarksOffline = action.payload;
      }
    },
    setSummaryTranslations: (state, action: PayloadAction<StoreState['summaryTranslations']>) => {
      if (state) {
        state.summaryTranslations = action.payload;
      }
    },
  },
});

export const { 
  setBookmarkedSummaries,
  setReadSummaries,
  setRemovedSummaries,
  setSaveBookmarksOffline,
  setSummaryTranslations,
} = summarySlice.actions;