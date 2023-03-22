import React from "react";
import { Input, InputNumber } from "antd";
import { Typography } from "antd";

const MoneyProductPromotion = ({
  formState = {},
  setFormState,
  errMessage = {},
}) => {
  return (
    <>
      <Typography.Title level={5} className="promotion_line_form_bottom_title">
        Chiếu khấu theo giá trị hóa đơn
      </Typography.Title>
      <div className="promotion_line_form_bottom">
        <div className="promotion_line_form_bottom_left">
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">
              Giá trị hóa đơn tối thiểu
            </div>
            <div className="promotion_line_form_input_wrap">
              <InputNumber
                className="promotion_line_form_input"
                size="small"
                value={formState.minCost}
                onChange={(value) => {
                  if (value) {
                    setFormState({
                      ...formState,
                      minCost: value,
                    });
                  }
                }}
                min={1}
                status={errMessage.minCost && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.minCost}
              </div>
            </div>
          </div>
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">Số tiền chiết khấu</div>
            <div className="promotion_line_form_input_wrap">
              <InputNumber
                className="promotion_line_form_input"
                size="small"
                value={formState.discountMoney}
                onChange={(value) => {
                  setFormState({
                    ...formState,
                    discountMoney: value,
                  });
                }}
                min={0}
                status={errMessage.discountMoney && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.discountMoney}
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
                  setFormState({
                    ...formState,
                    discountRate: value,
                  });
                }}
                min={0}
                max={100}
                status={errMessage.discountRate && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.discountRate}
              </div>
            </div>
          </div>
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">
              Số tiền chiết khấu tối đa
            </div>
            <div className="promotion_line_form_input_wrap">
              <InputNumber
                className="promotion_line_form_input"
                size="small"
                value={formState.maxDiscountMoney}
                onChange={(value) => {
                  if (value) {
                    setFormState({
                      ...formState,
                      maxDiscountMoney: value,
                    });
                  }
                }}
                min={1}
                status={errMessage.maxDiscountMoney && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.maxDiscountMoney}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoneyProductPromotion;
