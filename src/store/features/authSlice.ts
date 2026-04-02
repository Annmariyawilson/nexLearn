import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserProfile } from "@/types/auth";

const initialState: AuthState = {
  mobile: "",
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMobile: (state, action: PayloadAction<string>) => {
      state.mobile = action.payload;
    },
    setAuthTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.mobile = "";
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setMobile, setAuthTokens, setUser, logoutUser } =
  authSlice.actions;

export default authSlice.reducer;