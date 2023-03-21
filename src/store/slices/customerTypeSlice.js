import { createSlice } from "@reduxjs/toolkit";

const initState = {
  customerTypes: [],
  refresh: false,
};

export const customerType = createSlice({
  name: "customerType",
  initialState: initState,
  reducers: {
    setCustomerTypes: (state, action) => {
      state.customerTypes = action.payload;
      state.refresh = false;
    },
    setRefreshCustomerTypes: (state) => {
      state.refresh = true;
    },
  },
});

export const { setCustomerTypes, setRefreshCustomerTypes } =
  customerType.actions;
export default customerType.reducer;
