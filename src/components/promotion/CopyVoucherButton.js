import { Button, InputNumber, Popconfirm, message } from "antd";
import React, { useState } from "react";
import { DiffOutlined } from "@ant-design/icons";

const CopyVoucherButton = ({ addNewMore }) => {
  const [numberInput, setNumberInput] = useState(0);
  const confirm = () => {
    addNewMore(numberInput);
  };

  return (
    <Popconfirm
      placement="topRight"
      title={"Tạo nhanh phiếu giảm giá tương tự"}
      description={
        <div
          style={{
            display: "flex",
          }}
        >
          <div>Số lượng</div>
          <InputNumber
            min={0}
            value={numberInput}
            onChange={(value) => {
              setNumberInput(value);
            }}
            size="small"
            style={{
              marginLeft: 12,
            }}
          />
        </div>
      }
      onConfirm={confirm}
      okText="Tạo nhanh"
      cancelText="Đóng"
    >
      <DiffOutlined
        style={{
          cursor: "pointer",
        }}
      />
    </Popconfirm>
  );
};

export default CopyVoucherButton;
