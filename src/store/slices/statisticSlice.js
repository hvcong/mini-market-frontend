import { createSlice } from "@reduxjs/toolkit";

const initState = {
  allStoreInputs: {
    data: [],
  },
  allStorages: {
    data: [],
  },
  allPromotions: {
    data: [],
  },
  allRetrieves: {
    data: [],
  },
  allBills: {
    data: [],
  },
  allBillsDay: {
    data: [],
  },
  allBillsCustomers: {
    data: [],
  },
};

export const statisSlice = createSlice({
  name: "statis",
  initialState: initState,
  reducers: {
    setAllStoreInputs: (state, action) => {
      state.allStoreInputs.data = action.payload;
    },
    setAllBils: (state, action) => {
      state.allBills.data = action.payload;
    },
    setAllRetrieves: (state, action) => {
      state.allRetrieves.data = action.payload;
    },
    setAllPromotions: (state, action) => {
      state.allPromotions.data = action.payload;
    },
    setAllStorages: (state, action) => {
      state.allStorages.data = action.payload;
    },
    setAllBillsDay: (state, action) => {
      state.allBillsDay.data = action.payload;
    },
    setAllBillsCustomers: (state, action) => {
      state.allBillsCustomers.data = action.payload;
    },
  },
});

export const {
  setAllStoreInputs,
  setAllBils,
  setAllRetrieves,
  setAllPromotions,
  setAllStorages,
  setAllBillsCustomers,
  setAllBillsDay,
} = statisSlice.actions;
export default statisSlice.reducer;
