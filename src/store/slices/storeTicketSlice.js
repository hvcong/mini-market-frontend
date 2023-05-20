import { createSlice } from "@reduxjs/toolkit";

const initState = {
  storeTickets: [],
  count: 0,
  refresh: false,
};

export const storeTicketSlice = createSlice({
  name: "storeTicket",
  initialState: initState,
  reducers: {
    setStoreTickets: (state, action) => {
      //console.log(action.payload);
      state.storeTickets = action.payload.rows;
      state.count = action.payload.count;
      state.refresh = false;
    },
    setRefreshStoreTickets: (state) => {
      state.refresh = true;
    },
  },
});

export const { setStoreTickets, setRefreshStoreTickets } =
  storeTicketSlice.actions;
export default storeTicketSlice.reducer;
