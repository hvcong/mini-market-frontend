import { createSlice } from "@reduxjs/toolkit";

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
      // action.payload is the products array directly
      state.products = action.payload || [];
      state.count = action.payload ? action.payload.length : 0;
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
