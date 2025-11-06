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
      // action.payload is the categories array directly
      state.categories = action.payload || [];
      state.count = action.payload ? action.payload.length : 0;
      state.refresh = false;
    },
    setRefreshCate: (state) => {
      state.refresh = true;
    },
  },
});

export const { setCates, setRefreshCate } = cateSlice.actions;
export default cateSlice.reducer;
