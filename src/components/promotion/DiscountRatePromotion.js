import React from "react";
import { Input, InputNumber } from "antd";
import { Typography } from "antd";
import ProductIdSelect from "./ProductIdSelect";
import UnitTypeSelectByProductId from "./UnitTypeSelectByProductId";

const DiscountRatePromotion = ({
  formState = {},
  setFormState,
  errMessage = {},
}) => {
  return (
    <>
      <Typography.Title level={5} className="promotion_line_form_bottom_title">
        Chiết khấu trên từng sản phẩm
      </Typography.Title>
      <div className="promotion_line_form_bottom">
        <div className="promotion_line_form_bottom_left">
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">Mã sản phẩm</div>
            <div className="promotion_line_form_input_wrap">
              <ProductIdSelect
                className="promotion_line_form_input"
                size="small"
                value={formState.productId}
                onChange={(value) => {
                  console.log(value);
                  setFormState({
                    ...formState,
                    productId: value,
                  });
                }}
                status={errMessage.productId && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.productId}
              </div>
            </div>
          </div>
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">Đơn vị tính</div>
            <div className="promotion_line_form_input_wrap">
              <UnitTypeSelectByProductId
                className="promotion_line_form_input"
                size="small"
                value={formState.ut}
                productId={formState.productId}
                onChange={(value) => {
                  setFormState({
                    ...formState,
                    ut: value,
                  });
                }}
                status={errMessage.ut && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.ut}
              </div>
            </div>
          </div>
        </div>
        <div className="promotion_line_form_bottom_right">
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">Số % chiết khấu</div>
            <div className="promotion_line_form_input_wrap">
              <InputNumber
                className="promotion_line_form_input"
                size="small"
                value={formState.discountRate}
                onChange={(value) => {
                  if (value) {
                    setFormState({
                      ...formState,
                      discountRate: value,
                    });
                  }
                }}
                min={1}
                status={errMessage.discountRate && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.discountRate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscountRatePromotion;
