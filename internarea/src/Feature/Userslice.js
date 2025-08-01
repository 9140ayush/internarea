import { createSlice } from "@reduxjs/toolkit";

export const userslice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = {
        ...action.payload,
        firebaseUid: action.payload.uid,
        id: action.payload.uid
      };
    },
    logout: (state) => {
      state.user = null;
    },
  },
});
export const { login, logout } = userslice.actions;
export const selectuser = (state) => state.user.user;
export default userslice.reducer;
