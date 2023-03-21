import { createSlice } from "@reduxjs/toolkit";

const initState = {
  unitTypes: [],
  count: 0,
  refresh: false,
};

export const unitTypeSlice = createSlice({
  name: "unitType",
  initialState: initState,
  reducers: {
    setUnitTypes: (state, action) => {
      state.unitTypes = action.payload.rows;
      state.count = action.payload.count;
      state.refresh = false;
    },
    setRefreshUnitType: (state) => {
      state.refresh = true;
    },
  },
});

export const { setUnitTypes, setRefreshUnitType } = unitTypeSlice.actions;
export default unitTypeSlice.reducer;
