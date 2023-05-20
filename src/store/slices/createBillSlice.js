import { createSlice } from "@reduxjs/toolkit";

const initState = {
  tabState: {
    activeKey: "1",
    tabItems: [
      {
        label: "Phiếu tạm",
        key: "1",
        customerPhone: "0",
        newPhoneInput: "",
        isShowNewCustomer: false,
        voucherUsed: null,
        voucherInput: "",
      },
    ],
  },
  listState: {
    1: [
      // list bill product item
    ],
  },
  refresh: true,
  tabCountNumber: 2,
};

export const createBillState = createSlice({
  name: "createBill",
  initialState: initState,
  reducers: {
    addTab: (state, action) => {
      state.tabState.activeKey = action.payload.key;
      state.tabState.tabItems.push({
        ...action.payload,
        label: "Đơn hàng " + state.tabCountNumber++,
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
        state.tabCountNumber = 1;
      }
      state.tabState.tabItems = tabItems;
      state.listState[state.tabState.activeKey] = [];
      state.tabState.activeKey = activeKey;
    },

    addOneProductToActiveTab: (state, action) => {
      let isExits = false;
      let newPriceLine = action.payload;
      let list = state.listState[state.tabState.activeKey];

      let newList = list.map((priceLine) => {
        if (priceLine.id == newPriceLine.id) {
          isExits = true;
          return {
            ...priceLine,
            quantity: priceLine.quantity + newPriceLine.quantity,
          };
        }
        return priceLine;
      });

      if (!isExits) {
        newList.push(newPriceLine);
      }

      state.listState[state.tabState.activeKey] = newList;
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
      //console.log(action.payload);
      list = list.filter((item) => item.id != action.payload);
      state.listState[state.tabState.activeKey] = list;
    },
    removeAllProductOnActiveTab: (state, action) => {
      state.listState[state.tabState.activeKey] = [];
    },
    onChangeCustomerPhone: (state, action) => {
      //console.log("phone:", action.payload);
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
    setRefreshTabCreateBill: (state, action) => {
      state.refresh = true;
    },

    setNewPhoneInput: (state, action) => {
      let _tabItems = state.tabState.tabItems;
      let activeKey = state.tabState.activeKey;
      _tabItems = _tabItems.map((item) => {
        if (item.key == activeKey) {
          return {
            ...item,
            newPhoneInput: action.payload,
          };
        }
        return item;
      });
      state.tabState.tabItems = _tabItems;
    },

    setIsShowNewCustomer: (state, action) => {
      let _tabItems = state.tabState.tabItems;
      let activeKey = state.tabState.activeKey;
      _tabItems = _tabItems.map((item) => {
        if (item.key == activeKey) {
          return {
            ...item,
            isShowNewCustomer: action.payload,
            customerPhone: "",
          };
        }
        return item;
      });
      state.tabState.tabItems = _tabItems;
    },

    setVoucherUsed: (state, action) => {
      let _tabItems = state.tabState.tabItems;
      let activeKey = state.tabState.activeKey;
      _tabItems = _tabItems.map((item) => {
        if (item.key == activeKey) {
          return {
            ...item,
            voucherUsed: action.payload,
          };
        }
        return item;
      });
      state.tabState.tabItems = _tabItems;
    },
    setVoucherInput: (state, action) => {
      let _tabItems = state.tabState.tabItems;
      let activeKey = state.tabState.activeKey;
      _tabItems = _tabItems.map((item) => {
        if (item.key == activeKey) {
          return {
            ...item,
            voucherInput: action.payload,
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
  setNewPhoneInput,
  setIsShowNewCustomer,
  setVoucherUsed,
  setVoucherInput,
} = createBillState.actions;
export default createBillState.reducer;
