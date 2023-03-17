import { Tabs } from "antd";
import { useRef, useState } from "react";

const TabsCreateBill = ({ tabState, setTabState }) => {
  const { tabItems, activeKey } = tabState;
  const newTabIndex = useRef(0);

  const onChange = (newActiveKey) => {
    setTabState({
      ...tabState,
      activeKey: newActiveKey,
    });
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...tabItems];
    newPanes.push({
      label: "Hóa đơn " + (newTabIndex.current + 1),
      children: "abd",
      key: newActiveKey,
    });
    setTabState({
      tabItems: newPanes,
      activeKey: newActiveKey,
    });
  };

  const remove = (targetKey) => {
    if (tabItems.length == 1) {
      return;
    }

    let newActiveKey = activeKey;
    let lastIndex = -1;
    tabItems.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = tabItems.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setTabState({
      tabItems: newPanes,
      activeKey: newActiveKey,
    });
  };

  const onEdit = (targetKey, action) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
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
