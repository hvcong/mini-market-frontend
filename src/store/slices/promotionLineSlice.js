import { createSlice } from "@reduxjs/toolkit";

const initState = {
  promotionLines: [],
  refresh: false,
};

export const promotionLineSlice = createSlice({
  name: "promotionLine",
  initialState: initState,
  reducers: {
    setPromotionLines: (state, action) => {
      state.promotionLines = action.payload;
      state.refresh = false;
    },
    setRefreshPromotionLines: (state) => {
      state.refresh = true;
    },
  },
});

export const { setPromotionLines, setRefreshPromotionLines } =
  promotionLineSlice.actions;
export default promotionLineSlice.reducer;
