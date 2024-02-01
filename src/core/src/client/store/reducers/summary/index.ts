import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { DatedEvent, StoreState } from '../../types';

import { PublicSummaryAttributes } from '~/api';

export type SummarySliceState = Pick<StoreState, 'bookmarkedSummaries' | 'readSummaries' | 'removedSummaries' | 'saveBookmarksOffline' | 'summaryTranslations'>;

export type UserActionType = 'SET_USER';

const summarySlice = createSlice({
  initialState: null as SummarySliceState | null,
  name: 'summary',
  reducers: { 
    bookmarkSummary: (state, action: PayloadAction<PublicSummaryAttributes>) => {
      if (state?.bookmarkedSummaries) {
        state.bookmarkedSummaries[action.payload.id] = new DatedEvent(action.payload);
      }
    },
    setBookmarkedSummaries: (state, action: PayloadAction<SummarySliceState>) => {
      if (state) {
        state.bookmarkedSummaries = action.payload.bookmarkedSummaries;
      }
    },
    setReadSummaries: (state, action: PayloadAction<SummarySliceState>) => {
      if (state) {
        state.readSummaries = action.payload.readSummaries;
      }
    },
    setRemovedSummaries: (state, action: PayloadAction<SummarySliceState>) => {
      if (state) {
        state.removedSummaries = action.payload.removedSummaries;
      }
    },
    setSaveBookmarksOffline: (state, action: PayloadAction<SummarySliceState>) => {
      if (state) {
        state.saveBookmarksOffline = action.payload.saveBookmarksOffline;
      }
    },
    setSummaryTranslations: (state, action: PayloadAction<SummarySliceState>) => {
      if (state) {
        state.summaryTranslations = action.payload.summaryTranslations;
      }
    },
  },
});

export const { 
  bookmarkSummary,
  setBookmarkedSummaries,
  setReadSummaries,
  setRemovedSummaries,
  setSaveBookmarksOffline,
  setSummaryTranslations,
} = summarySlice.actions;

export default summarySlice.reducer;