// client/src/store/authSlice.ts (ИСПРАВЛЕННАЯ ВЕРСИЯ)

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'; // <-- ИСПРАВЛЕНО ЗДЕСЬ
import { type UserProfile } from './apiSlice'; // <-- И ИСПРАВЛЕНО ЗДЕСЬ

interface AuthState {
  profile: UserProfile | null;
}

const initialState: AuthState = {
  profile: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    logout: (state) => {
      state.profile = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;