import React, { useState } from "react";
import { Input, InputNumber, Select, Table } from "antd";
import { Typography } from "antd";

const typeMPs = [
  {
    value: "discountMoney",
    label: "Tiền",
  },
  {
    value: "discountRate",
    label: "Phần trăm (%)  ",
  },
];

const VoucherPromotion = ({
  formState = {},
  setFormState,
  errMessage = {},
  modalType,
}) => {
  const [allColumns, setAllColumns] = useState([
    {
      title: "Mã CODE",
    },
    {
      title: "Hình thức chiết khấu",
    },
    {
      title: "Số tiền chiết khấu",
    },
    {
      title: "% chiếu khấu",
    },
    {
      title: "Số tiền tối đa",
    },
  ]);

  return (
    <>
      <Typography.Title level={5} className="voucher_modal_bottom_title">
        Phiếu giảm giá
      </Typography.Title>

      <div className="voucher_modal_bottom">
        <div className="voucher_line_modal">
          <Table columns={allColumns} size="small" />
        </div>
      </div>
    </>
  );
};

export default VoucherPromotion;
