import React from "react";
import { Input } from "antd";
import { Typography } from "antd";

const VoucherPromotion = ({
  formState = {},
  setFormState,
  errMessage = {},
}) => {
  return (
    <>
      <Typography.Title level={5} className="promotion_line_form_bottom_title">
        Phiếu giảm giá
      </Typography.Title>
      <div className="promotion_line_form_bottom">
        <div className="promotion_line_form_bottom_left">
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">Mã code</div>
            <div className="promotion_line_form_input_wrap">
              <Input
                className="promotion_line_form_input"
                size="small"
                value={formState.code}
                onChange={({ target }) => {
                  setFormState({
                    ...formState,
                    code: target.value,
                  });
                }}
                status={errMessage.code && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.code}
              </div>
            </div>
          </div>
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">Số tiền chiết khấu</div>
            <div className="promotion_line_form_input_wrap">
              <Input
                className="promotion_line_form_input"
                size="small"
                value={formState.discountMoney}
                onChange={(value) => {
                  if (value) {
                    setFormState({
                      ...formState,
                      discountMoney: value,
                    });
                  }
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
              <Input
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
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">
              Số tiền chiết khấu tối đa
            </div>
            <div className="promotion_line_form_input_wrap">
              <Input
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

export default VoucherPromotion;
