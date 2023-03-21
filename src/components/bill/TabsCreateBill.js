import { Tabs } from "antd";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  addTab,
  removeOneTab,
  setActiveKeyTab,
} from "../../store/slices/createBillSlice";

const TabsCreateBill = () => {
  const { tabState } = useSelector((state) => state.createBill);
  const dispatch = useDispatch();

  const { tabItems, activeKey } = tabState;
  const newTabIndex = useRef(1);

  const onChange = (newActiveKey) => {
    dispatch(setActiveKeyTab(newActiveKey));
  };

  const onEdit = (targetKey, action) => {
    if (action === "add") {
      let _newTab = {
        label: "Hóa đơn " + (newTabIndex.current + 1),
        children: "abd",
        key: `newTab${newTabIndex.current++}`,
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
