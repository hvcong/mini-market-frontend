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

const VoucherPromotionDetail = ({
  formState = {},
  setFormState,
  errMessage = {},
  modalType,
  disabledInput,
}) => {
  return (
    <>
      <Typography.Title level={5} className="voucher_modal_bottom_title">
        Phiếu giảm giá
      </Typography.Title>

      <div className="voucher_modal_bottom">
        <div className="voucher_line_modal">
          <div className="voucher_line_modal_detail">
            <div className="promotion_line_form_bottom">
              <div className="promotion_line_form_bottom_left">
                <div className="promotion_line_form_group">
                  <div className="promotion_line_form_label">Mã code</div>
                  <div className="promotion_line_form_input_wrap">
                    <Input
                      className="promotion_line_form_input"
                      size="small"
                      disabled={disabledInput("code")}
                      value={formState.code}
                      onChange={(value) => {
                        if (value) {
                          setFormState({
                            ...formState,
                            code: value,
                          });
                        }
                      }}
                      min={1}
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
                      value={formState.type}
                      onChange={(value) => {
                        if (value) {
                          setFormState({
                            ...formState,
                            type: value,
                          });
                        }
                      }}
                      disabled={disabledInput("type")}
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
                {formState.type == "discountRate" && (
                  <div className="promotion_line_form_group">
                    <div className="promotion_line_form_label">
                      {" "}
                      % chiết khấu
                    </div>
                    <div className="promotion_line_form_input_wrap">
                      <InputNumber
                        className="promotion_line_form_input"
                        size="small"
                        disabled={disabledInput("discountRate")}
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
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        disabled={disabledInput("discountMoney")}
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
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        disabled={disabledInput("maxDiscountMoney")}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoucherPromotionDetail;
