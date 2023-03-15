import { createSlice } from "@reduxjs/toolkit";

const initState = {
  priceHeaders: [],
  count: 0,
  refresh: false,
};

export const priceHeaderSlice = createSlice({
  name: "priceHeader",
  initialState: initState,
  reducers: {
    setPriceHeaders: (state, action) => {
      state.priceHeaders = action.payload.rows;
      state.count = action.payload.count;
      state.refresh = false;
    },
    setRefreshPriceHeaders: (state) => {
      state.refresh = true;
    },
  },
});

export const { setPriceHeaders, setRefreshPriceHeaders } =
  priceHeaderSlice.actions;
export default priceHeaderSlice.reducer;
