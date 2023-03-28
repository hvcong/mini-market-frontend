import { createSlice } from "@reduxjs/toolkit";

const initState = {
  tabState: {
    activeKey: "1",
    tabItems: [
      {
        label: "Hóa đơn 1",
        key: "1",
        customerPhone: "0",
      },
    ],
  },
  listState: {
    1: [
      // list bill product item
    ],
  },
  refresh: false,
};

export const createBillState = createSlice({
  name: "createBill",
  initialState: initState,
  reducers: {
    addTab: (state, action) => {
      state.tabState.activeKey = action.payload.key;
      state.tabState.tabItems.push({
        ...action.payload,
        customerPhone: "0",
      });
      state.listState[action.payload.key] = [];
    },
    setActiveKeyTab: (state, action) => {
      state.tabState.activeKey = action.payload;
    },
    removeOneTab: (state, action) => {
      let ind = 0;
      let { tabItems } = state.tabState;
      let activeKey = state.tabState.activeKey;

      if (tabItems.length > 1) {
        tabItems = tabItems.filter((item, index) => {
          if (item.key == action.payload) {
            ind = index;

            return false;
          }
          return true;
        });

        if (action.payload == activeKey) {
          if (ind == 0) {
            activeKey = tabItems[ind].key;
          } else {
            activeKey = tabItems[ind - 1].key;
          }
        }
      } else {
        tabItems = [];
        activeKey = "";
      }
      state.tabState.tabItems = tabItems;
      state.listState[state.tabState.activeKey] = [];
      state.tabState.activeKey = activeKey;
    },

    addOneProductToActiveTab: (state, action) => {
      state.listState[state.tabState.activeKey].push(action.payload);
    },

    updateQuantityOneProduct: (state, action) => {
      let list = state.listState[state.tabState.activeKey];
      list = list.map((item) => {
        if (item.id == action.payload.id) {
          return {
            ...item,
            quantity: action.payload.quantity,
          };
        }
        return item;
      });
      state.listState[state.tabState.activeKey] = list;
    },
    removeOneProductLine: (state, action) => {
      // id of priceline
      let list = state.listState[state.tabState.activeKey];
      console.log(action.payload);
      list = list.filter((item) => item.id != action.payload);
      state.listState[state.tabState.activeKey] = list;
    },
    removeAllProductOnActiveTab: (state, action) => {
      state.listState[state.tabState.activeKey] = [];
    },
    onChangeCustomerPhone: (state, action) => {
      let _tabItems = state.tabState.tabItems;
      let activeKey = state.tabState.activeKey;
      _tabItems = _tabItems.map((item) => {
        if (item.key == activeKey) {
          return {
            ...item,
            customerPhone: action.payload,
          };
        }
        return item;
      });
      state.tabState.tabItems = _tabItems;
    },
    clearOneTab: (state, action) => {
      state.listState[state.tabState.activeKey] = [];
      let _tabItems = state.tabState.tabItems;
      let activeKey = state.tabState.activeKey;
      _tabItems = _tabItems.map((item) => {
        if (item.key == activeKey) {
          return {
            ...item,
            customerPhone: "0",
          };
        }
        return item;
      });
      state.tabState.tabItems = _tabItems;
    },
  },
});

export const {
  addTab,
  setActiveKeyTab,
  removeOneTab,
  addOneProductToActiveTab,
  updateQuantityOneProduct,
  removeOneProductLine,
  onChangeCustomerPhone,
  removeAllProductOnActiveTab,
  clearOneTab,
} = createBillState.actions;
export default createBillState.reducer;
