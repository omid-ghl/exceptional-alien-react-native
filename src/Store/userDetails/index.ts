import {Gem} from '@/Models';
import {PlayBook} from '@/Models/PlayBook';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type UserDataList = {
  userGems: Gem[];
  userPlaybooks: PlayBook[];
  createdPlaybooks: PlayBook[];
};

const initialState: UserDataList = {
  userPlaybooks: [],
  userGems: [],
  createdPlaybooks: [],
};

const slice = createSlice({
  name: 'userDataList',
  initialState: initialState,
  reducers: {
    setUserGems: (state, action: PayloadAction<Gem[]>) => {
      state.userGems = action.payload;
    },
    addUserGem: (state, action: PayloadAction<Gem>) => {
      if (state.userGems.some(x => x.id === action.payload.id)) {
        return;
      }
      state.userGems = [...state.userGems, action.payload];
    },
    removeUserGem: (state, action: PayloadAction<{gemId: number}>) => {
      const index = state.userGems.findIndex(
        x => x.id === action.payload.gemId,
      );
      if (index < 0) {
        return;
      }
      const newUserGems = [...state.userGems];
      newUserGems.splice(index, 1);
      state.userGems = newUserGems;
    },
    setUserPlaybooks: (state, action: PayloadAction<PlayBook[]>) => {
      state.userPlaybooks = action.payload;
    },
    addUserPlaybook: (state, action: PayloadAction<PlayBook>) => {
      if (state.userPlaybooks.some(x => x.id === action.payload.id)) {
        return;
      }
      state.userPlaybooks = [...state.userPlaybooks, action.payload];
    },
    setCreatedUserPlaybooks: (state, action: PayloadAction<PlayBook[]>) => {
      state.createdPlaybooks = action.payload;
    },
    reset: state => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setUserGems,
  setUserPlaybooks,
  setCreatedUserPlaybooks,
  addUserGem,
  removeUserGem,
  addUserPlaybook,
  reset,
} = slice.actions;

export default slice.reducer;
