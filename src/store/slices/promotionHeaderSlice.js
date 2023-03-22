import { createSlice } from "@reduxjs/toolkit";

const initState = {
  promotionHeaders: [],
  count: 0,
  refresh: false,
};

export const promotionHeaderSlice = createSlice({
  name: "promotionHeader",
  initialState: initState,
  reducers: {
    setPromotionHeaders: (state, action) => {
      state.promotionHeaders = action.payload.rows;
      state.count = action.payload.count;
      state.refresh = false;
    },
    setRefreshPromotionHeaders: (state) => {
      state.refresh = true;
    },
  },
});

export const { setPromotionHeaders, setRefreshPromotionHeaders } =
  promotionHeaderSlice.actions;
export default promotionHeaderSlice.reducer;
