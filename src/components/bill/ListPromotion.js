import React, { useEffect } from "react";
import { Tag, Typography } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setOpen } from "../../store/slices/modalSlice";

const namePromotion = {
  PP: "Mua sản phẩm tặng sản phẩm",
  DRP: "Giảm giá sản phẩm",
  MP: "Giảm tiền theo hóa đơn",
  V: "Phiếu giảm giá",
};

const ListPromotion = ({ listKM = [] }) => {
  const dispatch = useDispatch();
  return (
    <>
      <div className="bill_form_promotion_item">
        <div className="bill_form_promotion_item_id">
          <Typography.Title level={5}>Mã khuyến mãi</Typography.Title>
        </div>
        <div className="bill_form_promotion_item_type">
          <Typography.Title level={5}>Tiêu đề</Typography.Title>
        </div>
        <div className="bill_form_promotion_item_status">
          <Typography.Title level={5}>Trạng thái</Typography.Title>
        </div>
        <div className="bill_form_promotion_item_note">
          <Typography.Title level={5}>Ghi chú</Typography.Title>
        </div>
      </div>
      {listKM.map((result) => {
        let id = "";
        let title = "";
        let type = result.type;
        let promotionHeaderId = "";
        let code = "";

        if (type == "PP") {
          id = result.ProductPromotion.id;
          title = result.ProductPromotion.title;
          promotionHeaderId = result.ProductPromotion.PromotionHeaderId;
        }
        if (type == "DRP") {
          id = result.DiscountRateProduct.id;
          title = result.DiscountRateProduct.title;
          promotionHeaderId = result.DiscountRateProduct.PromotionHeaderId;
        }
        if (type == "MP") {
          id = result.MoneyPromotion.id;
          title = result.MoneyPromotion.title;
          promotionHeaderId = result.MoneyPromotion.PromotionHeaderId;
        }
        if (type == "V") {
          id = result.Voucher.id;
          code = result.Voucher.code;
          title = result.Voucher.title;
          promotionHeaderId = result.Voucher.PromotionHeaderId;
        }

        return (
          <div className="bill_form_promotion_item border">
            <Typography.Link
              className="bill_form_promotion_item_id"
              onClick={() => {
                dispatch(
                  setOpen({
                    name: "PromotionLineModal",
                    modalState: {
                      type: "view",
                      visible: true,
                      idSelected: id,
                      promotionHeaderId,
                    },
                  })
                );
              }}
            >
              {code ? code : id}
            </Typography.Link>
            <div className="bill_form_promotion_item_type">{title}</div>
            <div className="bill_form_promotion_item_status">
              {result.isSuccess ? (
                <Tag color="green">Thành công</Tag>
              ) : (
                <Tag color="red">Không thành công</Tag>
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
