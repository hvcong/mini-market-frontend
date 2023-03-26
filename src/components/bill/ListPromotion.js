import React, { useEffect } from "react";
import { Tag, Typography } from "antd";
import { useState } from "react";

const namePromotion = {
  PP: "Mua sản phẩm tặng sản phẩm",
  DRP: "Giảm giá sản phẩm",
  MP: "Giảm tiền theo hóa đơn",
  V: "Phiếu giảm giá",
};

const ListPromotion = ({ listKM = [] }) => {
  return (
    <>
      <div className="bill_form_promotion_item">
        <div className="bill_form_promotion_item_id">
          <Typography.Title level={5}>Mã khuyến mãi</Typography.Title>
        </div>
        <div className="bill_form_promotion_item_type">
          <Typography.Title level={5}>Loại khuyến mãi</Typography.Title>
        </div>
        <div className="bill_form_promotion_item_status">
          <Typography.Title level={5}>Trạng thái</Typography.Title>
        </div>
        <div className="bill_form_promotion_item_note">
          <Typography.Title level={5}>Ghi chú</Typography.Title>
        </div>
      </div>
      {listKM.map((result) => {
        return (
          <div className="bill_form_promotion_item border">
            <Typography.Link className="bill_form_promotion_item_id">
              {result.id}
            </Typography.Link>
            <div className="bill_form_promotion_item_type">
              {namePromotion[result.type]}
            </div>
            <div className="bill_form_promotion_item_status">
              {result.isSuccess ? (
                <Tag color="green">Thành công</Tag>
              ) : (
                <Tag color="red">Thất bại</Tag>
              )}
            </div>
            <div className="bill_form_promotion_item_note">{result.note}</div>
          </div>
        );
      })}
    </>
  );
};

export default ListPromotion;
