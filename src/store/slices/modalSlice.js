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
    StoreCheckingDetail: {
      visible: false,
      type: "",
      idSelected: "",
    },
    BillCUModal: {
      visible: false,
      type: "",
      idSelected: "",
    },
    ResultDetailModal: {
      visible: false,
      type: "",
      idSelected: "",
    },
    PromotionLineModal: {
      visible: false,
      type: "",
      idSelected: "",
      promotionHeaderId: "",
      minMaxTime: "",
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
