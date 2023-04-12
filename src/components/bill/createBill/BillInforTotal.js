import { Typography } from "antd";
import React from "react";
import { convertToVND } from "../../../utils";

const BillInforTotal = ({ amountMoney }) => {
  return (
    <div className="bill_infor_total">
      <Typography.Title level={5}>Thông tin thanh toán</Typography.Title>
      <div className="bill_infor_total_item">
        <div className="bill_infor_total_label">Tạm tính</div>
        <div className="bill_infor_total_value">
          {convertToVND(amountMoney.subTotal)}
        </div>
      </div>
      <div className="bill_infor_total_item">
        <div className="bill_infor_total_label">Phiếu giảm giá</div>
        <div className="bill_infor_total_value">
          {amountMoney.discountByVoucher == 0
            ? "0"
            : convertToVND(-amountMoney.discountByVoucher)}
        </div>
      </div>
      <div className="bill_infor_total_item total">
        <div className="bill_infor_total_label">Tiền khách cần trả</div>
        <div className="bill_infor_total_value">
          {convertToVND(amountMoney.total)}
        </div>
      </div>
    </div>
  );
};

export default BillInforTotal;
