import { createSlice } from "@reduxjs/toolkit";

const initState = {
  account: {
    id: 2,
    name: "But",
    phonenumber: "0356267138",
  },
  isLogged: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initState,
  reducers: {},
});

export const {} = userSlice.actions;
export default userSlice.reducer;
