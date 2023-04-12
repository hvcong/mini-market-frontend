import { Tabs } from "antd";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { uid } from "./../../../utils/index";
import {
  addTab,
  removeOneTab,
  setActiveKeyTab,
} from "../../../store/slices/createBillSlice";

const TabsCreateBill = () => {
  const { tabState } = useSelector((state) => state.createBill);
  const dispatch = useDispatch();

  const { tabItems, activeKey } = tabState;
  const newTabIndex = useRef(2);

  const onChange = (newActiveKey) => {
    dispatch(setActiveKeyTab(newActiveKey));
  };

  const onEdit = (targetKey, action) => {
    if (action === "add") {
      let _newTab = {
        label: "Đơn hàng tạm",
        children: "abd",
        key: uid(),
      };
      dispatch(addTab(_newTab));
    } else {
      dispatch(removeOneTab(targetKey));
    }
  };
  return (
    <Tabs
      type="editable-card"
      onChange={onChange}
      activeKey={activeKey}
      onEdit={onEdit}
      items={tabItems}
      size="small"
    />
  );
};
export default TabsCreateBill;
