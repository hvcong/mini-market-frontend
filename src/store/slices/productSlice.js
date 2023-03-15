import { createSlice } from "@reduxjs/toolkit";
import productApi from "./../../api/productApi";

const initState = {
  products: [],
  count: 0,
  refresh: false,
};

export const productSlice = createSlice({
  name: "products",
  initialState: initState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.rows;
      state.count = action.payload.count;
      state.refresh = false;
    },

    setRefresh: (state, action) => {
      state.refresh = true;
    },
  },
});

export const { setProducts, setRefresh } = productSlice.actions;
// export const selectProduct = (state) => state.products;
export default productSlice.reducer;
