import "../../assets/styles/createBill.scss";
import { InputNumber } from "antd";
import React from "react";
import TabsCreateBill from "../../components/bill/TabsCreateBill";
import SearchProductInput from "../../components/price/SearchProductInput";
import ListProduct from "../../components/bill/ListProduct";
import BillInfor from "../../components/bill/BillInfor";

const CreateBill = () => {
  return (
    <div className="create_bill_container">
      <div className="header">
        <SearchProductInput
          placeholder="Thêm sản phẩm vào bảng giá"
          style={{
            width: "280px",
          }}
        />
        <InputNumber />
        <div className="scan_qr"></div>
        <div className="tabs_wrap">
          <TabsCreateBill />
        </div>
        <div className="right__btns"></div>
      </div>

      <div className="content">
        <div className="list_container">
          <ListProduct />
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
