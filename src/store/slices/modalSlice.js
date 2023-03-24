import { createSlice } from "@reduxjs/toolkit";

const initState = {
  modals: {
    UnitTypeCUModal: {
      visible: false,
      type: "",
      idSelected: "",
    },
    StoreCheckingModal: {
      visible: false,
      type: "",
      idSelected: "",
    },
  },
};

export const modalSlice = createSlice({
  name: "modal",
  initialState: initState,
  reducers: {
    setOpen: (state, action) => {
      console.log(action);
      state.modals[action.payload.name] = action.payload.modalState;
    },
  },
});

export const { setOpen } = modalSlice.actions;
export default modalSlice.reducer;
