import { createSlice } from "@reduxjs/toolkit";

const initState = {
  storeEnterTickets: [],
  count: 0,
  refresh: false,
};

export const storeEnterTicketSlice = createSlice({
  name: "storeEnterTicket",
  initialState: initState,
  reducers: {
    setStoreEnterTickets: (state, action) => {
      console.log(action.payload);
      state.storeEnterTickets = action.payload.rows;
      state.count = action.payload.count;
      state.refresh = false;
    },
    setRefreshStoreEnterTickets: (state) => {
      state.refresh = true;
    },
  },
});

export const { setStoreEnterTickets, setRefreshStoreEnterTickets } =
  storeEnterTicketSlice.actions;
export default storeEnterTicketSlice.reducer;
