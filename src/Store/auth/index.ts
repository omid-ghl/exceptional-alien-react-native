import {User} from '@/Models';
import {onboardingApi, tutorialApi, userApi} from '@/Services';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type AuthState = {
  token: string | null;
  user: User | null;
  guest: {
    guestMode: boolean;
  };
  userJustSignedUp: boolean;
};

const initialState: AuthState = {
  token: null,
  user: null,
  guest: {
    guestMode: false,
  },
  userJustSignedUp: false,
};

const slice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setGuestMode: (state, action: PayloadAction<boolean>) => {
      state.guest.guestMode = action.payload;
    },
    setUserJustSignedUp: (state, action: PayloadAction<boolean>) => {
      state.userJustSignedUp = action.payload;
    },
    reset: state => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: builder =>
    builder
      .addMatcher(
        userApi.endpoints.checkToken.matchFulfilled,
        (state, {payload}) => {
          state.user = payload;
        },
      )
      .addMatcher(
        userApi.endpoints.login.matchFulfilled,
        (state, {payload}) => {
          state.user = payload.user;
          state.token = payload.token;
        },
      )
      .addMatcher(
        tutorialApi.endpoints.tutorialFinished.matchFulfilled,
        (state, {payload}) => {
          state.user = payload.data;
        },
      )
      .addMatcher(
        onboardingApi.endpoints.onboardingComplete.matchFulfilled,
        (state, {payload}) => {
          state.user = payload.data;
        },
      ),
});

export const {setToken, setUser, setGuestMode, setUserJustSignedUp, reset} =
  slice.actions;

export default slice.reducer;
