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
    removePriceLineByProductId: (state, action) => {
      console.log(action.payload);
      state.priceLines = state.priceLines.filter((item) => {
        return item.ProductUnitType.Product.id != action.payload;
      });
    },
    removeAllPriceLines: (state) => {
      state.priceLines = [];
    },
    updateOnePriceLine: (state, action) => {
      state.priceLines = state.priceLines.map((item) => {
        if (item.ProductUnitTypeId == action.payload.ProductUnitTypeId) {
          return action.payload;
        }
        return item;
      });
    },
    addManyPriceLines: (state, action) => {
      state.priceLines.push(...action.payload);
    },
  },
});

export const {
  setPriceLines,
  addPriceLine,
  removePriceLineByProductId,
  removeAllPriceLines,
  updateOnePriceLine,
  addManyPriceLines,
} = priceLineSlice.actions;
export default priceLineSlice.reducer;
