import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { UserData } from '../../types';

const userSlice = createSlice({
  initialState: null as UserData | null,
  name: 'user',
  reducers: { setUserData: (_, action: PayloadAction<UserData>) => action.payload },
});

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;