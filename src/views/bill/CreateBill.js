import "../../assets/styles/createBill.scss";
import { InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import TabsCreateBill from "../../components/bill/TabsCreateBill";
import ListProduct from "../../components/bill/ListProduct";
import BillInfor from "../../components/bill/BillInfor";
import SearchProductInput from "../../components/bill/SearchProductInput";

const initTabState = {
  activeKey: "1",
  tabItems: [
    {
      label: "Hóa đơn 1",
      key: "1",
    },
  ],
};

const initProductBillState = {
  activeKey: "1",
  1: [
    // list bill product item
    {},
  ],
};

const CreateBill = () => {
  const [tabState, setTabState] = useState(initTabState);
  const [productBillState, setProductBillState] =
    useState(initProductBillState);

  useEffect(() => {
    setProductBillState({
      ...productBillState,
      activeKey: tabState.activeKey,
    });
    return () => {};
  }, [tabState]);

  return (
    <div className="create_bill_container">
      <div className="header">
        <SearchProductInput
          placeholder="Thêm sản phẩm vào bảng giá"
          style={{
            width: "360px",
          }}
        />
        <InputNumber />
        <div className="scan_qr"></div>
        <div className="tabs_wrap">
          <TabsCreateBill tabState={tabState} setTabState={setTabState} />
        </div>
        <div className="right__btns"></div>
      </div>

      <div className="content">
        <div className="list_container">
          <ListProduct items={productBillState[productBillState.activeKey]} />
        </div>
        <div className="bill_infor_container">
          <BillInfor />
        </div>
      </div>
      <div className="footer"></div>
    </div>
  );
};

export default CreateBill;
