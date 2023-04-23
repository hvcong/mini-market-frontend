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
      state.bills = action.payload.rows;
      state.count = action.payload.count;
      state.refresh = false;
    },
    setRefreshBills: (state, action) => {
      state.refresh = true;
    },
  },
});

export const { setBills, setRefreshBills } = billSlice.actions;
export default billSlice.reducer;
