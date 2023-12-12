import {Location} from '@/Models';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type LocationState = {
  selectedLocation: Location | null;
};

const initialState: LocationState = {
  selectedLocation: null,
};

const slice = createSlice({
  name: 'discover',
  initialState: initialState,
  reducers: {
    setSearchLocation: (state, action: PayloadAction<Location>) => {
      state.selectedLocation = action.payload;
    },
    updateSearchLocation: (state, action: PayloadAction<Location>) => {
      if (
        !state.selectedLocation ||
        state.selectedLocation.id === action.payload.id
      ) {
        state.selectedLocation = action.payload;
      }
    },
    reset: state => {
      Object.assign(state, initialState);
    },
  },
});

export const {setSearchLocation, updateSearchLocation, reset} = slice.actions;

export default slice.reducer;
