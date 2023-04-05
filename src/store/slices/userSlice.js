import { createSlice } from "@reduxjs/toolkit";

const initState = {
  account: {
    id: 1,
    name: "cong",
  },
  isLogged: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initState,
  reducers: {
    employeeLoginOke: (state, action) => {
      console.log(action.payload);
      state.account = action.payload;
      state.isLogged = true;
    },
  },
});

export const { employeeLoginOke } = userSlice.actions;
export default userSlice.reducer;
