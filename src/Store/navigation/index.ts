import {StackParamList} from '@/Navigators/Stacks';
import {PartialState, StackNavigationState} from '@react-navigation/native';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type NavigationState = {
  guestIntendedNavigationState:
    | StackNavigationState<StackParamList>
    | PartialState<StackNavigationState<StackParamList>>
    | null;
};

const initialState: NavigationState = {
  guestIntendedNavigationState: null,
};

const slice = createSlice({
  name: 'navigation',
  initialState: initialState,
  reducers: {
    setGuestIntendedNavigationState: (
      state,
      action: PayloadAction<
        | StackNavigationState<StackParamList>
        | PartialState<StackNavigationState<StackParamList>>
        | null
      >,
    ) => {
      state.guestIntendedNavigationState = action.payload;
    },
    reset: state => {
      Object.assign(state, initialState);
    },
  },
});

export const {setGuestIntendedNavigationState, reset} = slice.actions;

export default slice.reducer;
