import { createSlice } from "@reduxjs/toolkit";

const initState = {
  bills: [],
  count: 0,
  refresh: false,
};

export const billSlice = createSlice({
  name: "bill",
  initialState: initState,
  reducers: {
    setBills: (state, action) => {
      // action.payload is the bills array directly
      state.bills = action.payload || [];
      state.count = action.payload ? action.payload.length : 0;
      state.refresh = false;
    },
    setRefreshBills: (state, action) => {
      state.refresh = true;
    },
  },
});

export const { setBills, setRefreshBills } = billSlice.actions;
export default billSlice.reducer;
