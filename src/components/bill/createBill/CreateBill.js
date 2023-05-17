import "../../../assets/styles/createBill.scss";
import { Button, InputNumber } from "antd";
import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import TabsCreateBill from "./TabsCreateBill";
import ListProduct from "./ListProduct";
import BillInfor from "./BillInfor";
import { FullscreenOutlined } from "@ant-design/icons";
import SearchProductInput from "./SearchProductInput";
import barcodeImage from "../../../assets/images/barcode_icon.jpg";

const CreateBill = () => {
  const { tabState, listState } = useSelector((state) => state.createBill);
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div
      className={`create_bill_container ${
        isFullScreen && "full_screen_active"
      }`}
    >
      <div className="header">
        <SearchProductInput
          placeholder="Thêm sản phẩm vào bảng giá"
          style={{
            width: "360px",
          }}
        />

        <div className="tabs_wrap">
          <TabsCreateBill />
        </div>
        <div className="right__btns">
          <FullscreenOutlined
            className="full_screen_btn"
            onClick={() => {
              setIsFullScreen(!isFullScreen);
            }}
          />
        </div>
      </div>

      <div className="create_bill_content">
        <div className="list_container">
          <ListProduct />
        </div>
      </div>
      <div className="footer"></div>
    </div>
  );
};

export default CreateBill;
