import { createSlice } from "@reduxjs/toolkit";

const initState = {
  account: {
    // id: 1,
    // name: "cong",
  },
  isLogged: false,
  refresh: false,
  isAdmin: false,
  socket: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initState,
  reducers: {
    employeeLoginOke: (state, action) => {
      state.account = action.payload;

      state.isAdmin = action.payload.Account.role == "AD";
      state.isLogged = true;
      state.refresh = false;
    },
    logOut: (state, action) => {
      state.account = {};
      state.isLogged = false;
      state.refresh = false;
    },
    setRefreshUser: (state, action) => {
      state.refresh = true;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const { employeeLoginOke, logOut, setRefreshUser, setSocket } =
  userSlice.actions;
export default userSlice.reducer;
