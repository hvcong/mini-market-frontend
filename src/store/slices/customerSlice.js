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
      // action.payload is the customers array directly
      state.customers = action.payload || [];
      state.count = action.payload ? action.payload.length : 0;
      state.refresh = false;
    },
    setRefreshCustomer: (state) => {
      state.refresh = true;
    },
  },
});

export const { setCustomers, setRefreshCustomer } = customerSlice.actions;
export default customerSlice.reducer;
