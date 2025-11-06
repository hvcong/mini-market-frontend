import { createSlice } from "@reduxjs/toolkit";

const initState = {
  storeTrans: [],
  count: 0,
  refresh: false,
};

export const storeTranSlice = createSlice({
  name: "storeTran",
  initialState: initState,
  reducers: {
    setStoreTrans: (state, action) => {
      console.log(action.payload);
      state.storeTrans = action.payload || [];
      state.count = action.payload ? action.payload.length : 0;
      state.refresh = false;
    },
    setRefreshStoreTrans: (state) => {
      state.refresh = true;
    },
  },
});

export const { setStoreTrans, setRefreshStoreTrans } = storeTranSlice.actions;
export default storeTranSlice.reducer;
