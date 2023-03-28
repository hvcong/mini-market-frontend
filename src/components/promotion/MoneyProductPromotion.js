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

const MoneyProductPromotion = ({
  formState = {},
  setFormState,
  errMessage = {},
  modalType,
}) => {
  return (
    <>
      <Typography.Title level={5} className="promotion_line_form_bottom_title">
        Chiếu khấu theo giá trị hóa đơn
      </Typography.Title>
      <div className="promotion_line_form_bottom">
        <div className="promotion_line_form_bottom_left">
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">Tổng ngân sách</div>
            <div className="promotion_line_form_input_wrap">
              <InputNumber
                className="promotion_line_form_input"
                size="small"
                value={formState.budget}
                onChange={(value) => {
                  if (value) {
                    setFormState({
                      ...formState,
                      budget: value,
                    });
                  }
                }}
                min={1}
                status={errMessage.budget && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.budget}
              </div>
            </div>
          </div>

          {modalType == "update" && (
            <div className="promotion_line_form_group">
              <div className="promotion_line_form_label">Ngân sách còn lại</div>
              <div className="promotion_line_form_input_wrap">
                <InputNumber
                  className="promotion_line_form_input"
                  size="small"
                  disabled
                  value={formState.availableBudget}
                  onChange={(value) => {
                    if (value) {
                      setFormState({
                        ...formState,
                        availableBudget: value,
                      });
                    }
                  }}
                  min={1}
                  status={errMessage.availableBudget && "error"}
                />
                <div className="promotion_line_form_input_err">
                  {errMessage.availableBudget}
                </div>
              </div>
            </div>
          )}

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
        </div>

        <div className="promotion_line_form_bottom_right">
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">
              Hình thức tính tiền chiết khấu
            </div>
            <div className="promotion_line_form_input_wrap">
              <Select
                className="promotion_line_form_input"
                size="small"
                value={formState.type}
                onChange={(value) => {
                  if (value) {
                    setFormState({
                      ...formState,
                      type: value,
                    });
                  }
                }}
                options={typeMPs}
                status={errMessage.type && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.type}
              </div>
            </div>
          </div>
          {formState.type == "discountRate" && (
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
          )}

          {formState.type == "discountMoney" && (
            <div className="promotion_line_form_group">
              <div className="promotion_line_form_label">
                Số tiền chiết khấu
              </div>
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
          )}
          {formState.type == "discountRate" && (
            <div className="promotion_line_form_group">
              <div className="promotion_line_form_label">
                Số tiền chiết khấu tối đa
              </div>
              <div className="promotion_line_form_input_wrap">
                <InputNumber
                  className="promotion_line_form_input"
                  size="small"
                  value={formState.maxMoneyDiscount}
                  onChange={(value) => {
                    if (value) {
                      setFormState({
                        ...formState,
                        maxMoneyDiscount: value,
                      });
                    }
                  }}
                  min={1}
                  status={errMessage.maxMoneyDiscount && "error"}
                />

                <div className="promotion_line_form_input_err">
                  {errMessage.maxMoneyDiscount}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MoneyProductPromotion;
