import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user:null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
        
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user=action.payload.user
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
