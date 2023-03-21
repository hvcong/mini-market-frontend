import { createSlice } from "@reduxjs/toolkit";

const initState = {
  customers: [],
  count: 0,
  refresh: false,
};

export const customerSlice = createSlice({
  name: "customer",
  initialState: initState,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload.rows;
      state.count = action.payload.count;
      state.refresh = false;
    },
    setRefreshCustomer: (state) => {
      state.refresh = true;
    },
  },
});

export const { setCustomers, setRefreshCustomer } = customerSlice.actions;
export default customerSlice.reducer;
