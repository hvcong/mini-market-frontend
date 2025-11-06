import { createSlice } from "@reduxjs/toolkit";

const initState = {
  receiveBills: [],
  count: 0,
  refresh: false,
};

export const ReceiveBillSlice = createSlice({
  name: "receiveBill",
  initialState: initState,
  reducers: {
    setReceiveBills: (state, action) => {
      state.receiveBills = action.payload || [];
      state.count = action.payload ? action.payload.length : 0;
      state.refresh = false;
    },
    setRefreshReceiveBills: (state) => {
      state.refresh = true;
    },
  },
});

export const { setReceiveBills, setRefreshReceiveBills } =
  ReceiveBillSlice.actions;
export default ReceiveBillSlice.reducer;
