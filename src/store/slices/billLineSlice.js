import { createSlice } from "@reduxjs/toolkit";

const initState = {
  billLines: [],
  count: 0,
  refresh: false,
};

export const billLineSlice = createSlice({
  name: "billLine",
  initialState: initState,
  reducers: {
    setBillLines: (state, action) => {
      state.billLines = action.payload || [];
      state.count = action.payload ? action.payload.length : 0;
      state.refresh = false;
    },
    setRefreshBillLines: (state) => {
      state.refresh = true;
    },
  },
});

export const { setBillLines, setRefreshBillLines } = billLineSlice.actions;
export default billLineSlice.reducer;
