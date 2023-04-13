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
    StoreCUModal: {
      visible: false,
      type: "",
      idSelected: "",
    },
    BillPrintModal: {
      visible: false,
      type: "",
      idSelected: "",
    },
    ProfileModal: {
      visible: false,
      type: "",
      idSelected: "",
      refresh: false,
    },
  },
};

export const modalSlice = createSlice({
  name: "modal",
  initialState: initState,
  reducers: {
    setOpen: (state, action) => {
      state.modals[action.payload.name] = action.payload.modalState;
    },
    setRefreshModal: (state, action) => {
      state.modals[action.payload].refresh = true;
    },
  },
});

export const { setOpen, setRefreshModal } = modalSlice.actions;
export default modalSlice.reducer;
