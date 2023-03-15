import { createSlice } from "@reduxjs/toolkit";

const initState = {
  categories: [],
  count: 0,
  refresh: false,
};

export const cateSlice = createSlice({
  name: "cate",
  initialState: initState,
  reducers: {
    setCates: (state, action) => {
      state.categories = action.payload.rows;
      state.count = action.payload.count;
      state.refresh = false;
    },
    setRefreshCate: (state) => {
      state.refresh = true;
    },
  },
});

export const { setCates, setRefreshCate } = cateSlice.actions;
export default cateSlice.reducer;
