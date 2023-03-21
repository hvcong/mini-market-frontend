import { createSlice } from "@reduxjs/toolkit";

const initState = {
  employees: [],
  count: 0,
  refresh: false,
};

export const employeeSlice = createSlice({
  name: "employee",
  initialState: initState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload.rows;
      state.count = action.payload.count;
      state.refresh = false;
    },
    setRefreshEmployees: (state) => {
      state.refresh = true;
    },
  },
});

export const { setEmployees, setRefreshEmployees } = employeeSlice.actions;
export default employeeSlice.reducer;
