import React from "react";
import { Input, InputNumber, Select } from "antd";
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
                disabled={modalType == "update"}
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
            <div className="promotion_line_form_label">
              Hình thức tính tiền chiết khấu
            </div>
            <div className="promotion_line_form_input_wrap">
              <Select
                className="promotion_line_form_input"
                size="small"
                disabled={modalType == "update"}
                value={formState.type}
                onChange={(value) => {
                  setFormState({
                    ...formState,
                    type: value,
                  });
                }}
                options={typeMPs}
                status={errMessage.type && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.type}
              </div>
            </div>
          </div>
        </div>
        <div className="promotion_line_form_bottom_right">
          {formState.type == "discountMoney" ? (
            <div className="promotion_line_form_group">
              <div className="promotion_line_form_label">
                Số tiền chiết khấu
              </div>
              <div className="promotion_line_form_input_wrap">
                <InputNumber
                  className="promotion_line_form_input"
                  size="small"
                  disabled={modalType == "update"}
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
          ) : (
            <>
              <div className="promotion_line_form_group">
                <div className="promotion_line_form_label">Số % chiết khấu</div>
                <div className="promotion_line_form_input_wrap">
                  <InputNumber
                    className="promotion_line_form_input"
                    size="small"
                    disabled={modalType == "update"}
                    value={formState.discountRate}
                    onChange={(value) => {
                      setFormState({
                        ...formState,
                        discountRate: value,
                      });
                    }}
                    min={0}
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
                    disabled={modalType == "update"}
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VoucherPromotion;
