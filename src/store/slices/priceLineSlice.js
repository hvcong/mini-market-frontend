import { createSlice } from "@reduxjs/toolkit";

const initState = {
  priceLines: [],
};

export const priceLineSlice = createSlice({
  name: "priceLine",
  initialState: initState,
  reducers: {
    setPriceLines: (state, action) => {
      state.priceLines = action.payload;
    },
    addPriceLine: (state, action) => {
      state.priceLines.unshift(action.payload);
    },
    removePriceLineById: (state, action) => {
      state.priceLines = state.priceLines.filter((item) => {
        return item.id != action.payload;
      });
    },
  },
});

export const { setPriceLines, addPriceLine, removePriceLineById } =
  priceLineSlice.actions;
export default priceLineSlice.reducer;
