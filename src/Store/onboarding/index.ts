import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type OnboardinState = {
  selectedLocations: number[];
  selectedIndustries: number[];
};

const initialState: OnboardinState = {
  selectedIndustries: [],
  selectedLocations: [],
};

const slice = createSlice({
  name: 'onboarding',
  initialState: initialState,
  reducers: {
    setSelectedLocations: (state, action: PayloadAction<number[]>) => {
      state.selectedLocations = action.payload;
    },
    setSelectedIndustries: (state, action: PayloadAction<number[]>) => {
      state.selectedIndustries = action.payload;
    },
    reset: state => {
      Object.assign(state, initialState);
    },
  },
});

export const {setSelectedIndustries, setSelectedLocations, reset} =
  slice.actions;

export default slice.reducer;
