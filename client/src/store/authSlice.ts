import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UserProfile } from '../types';

interface AuthState {
  profile: UserProfile | null;
}

const initialState: AuthState = {
  profile: JSON.parse(localStorage.getItem('userProfile') || 'null'),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      localStorage.setItem('userProfile', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.profile = null;
      localStorage.removeItem('userProfile');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;