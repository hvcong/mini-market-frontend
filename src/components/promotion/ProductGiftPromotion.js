import React from "react";
import { Input, InputNumber } from "antd";
import { Typography } from "antd";
import { GiftOutlined } from "@ant-design/icons";
import UnitTypeSelectByProductId from "./UnitTypeSelectByProductId";
import ProductIdSelect from "./ProductIdSelect";

const ProductGiftPromotion = ({
  formState = {},
  setFormState,
  errMessage = {},
  modalType,
}) => {
  return (
    <>
      <Typography.Title level={5} className="promotion_line_form_bottom_title">
        Mua sản phẩm tặng sản phẩm
      </Typography.Title>
      <div className="promotion_line_form_bottom">
        <div className="promotion_line_form_bottom_left">
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">Mã sản phẩm</div>
            <div className="promotion_line_form_input_wrap">
              <ProductIdSelect
                className="promotion_line_form_input"
                size="small"
                value={formState.productId1}
                disabled={modalType == "update"}
                onChange={(value) => {
                  console.log(value);
                  setFormState({
                    ...formState,
                    productId1: value,
                  });
                }}
                status={errMessage.productId1 && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.productId1}
              </div>
            </div>
          </div>
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">Đơn vị tính </div>
            <div className="promotion_line_form_input_wrap">
              <UnitTypeSelectByProductId
                className="promotion_line_form_input"
                size="small"
                disabled={modalType == "update"}
                value={formState.ut1}
                productId={formState.productId1}
                onChange={(value) => {
                  setFormState({
                    ...formState,
                    ut1: value,
                  });
                }}
                status={errMessage.ut1 && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.ut1}
              </div>
            </div>
          </div>
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">Số lượng yêu cầu</div>
            <div className="promotion_line_form_input_wrap">
              <InputNumber
                className="promotion_line_form_input"
                size="small"
                disabled={modalType == "update"}
                value={formState.milestones}
                onChange={(value) => {
                  if (value) {
                    setFormState({
                      ...formState,
                      milestones: value,
                    });
                  }
                }}
                min={1}
                status={errMessage.milestones && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.milestones}
              </div>
            </div>
          </div>
        </div>
        <div className="promotion_line_form_bottom_right">
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">
              <GiftOutlined /> Mã sản phẩm
            </div>
            <div className="promotion_line_form_input_wrap">
              <ProductIdSelect
                className="promotion_line_form_input"
                size="small"
                disabled={modalType == "update"}
                value={formState.productId2}
                onChange={(value) => {
                  console.log(value);
                  setFormState({
                    ...formState,
                    productId2: value,
                  });
                }}
                status={errMessage.productId2 && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.productId2}
              </div>
            </div>
          </div>
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">
              <GiftOutlined /> Đơn vị tính
            </div>
            <div className="promotion_line_form_input_wrap">
              <UnitTypeSelectByProductId
                className="promotion_line_form_input"
                size="small"
                disabled={modalType == "update"}
                value={formState.ut2}
                productId={formState.productId2}
                onChange={(value) => {
                  setFormState({
                    ...formState,
                    ut2: value,
                  });
                }}
                status={errMessage.ut2 && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.ut2}
              </div>
            </div>
          </div>
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">
              <GiftOutlined /> Số lượng tặng
            </div>
            <div className="promotion_line_form_input_wrap">
              <InputNumber
                className="promotion_line_form_input"
                size="small"
                disabled={modalType == "update"}
                value={formState.quantity}
                onChange={(value) => {
                  if (value) {
                    setFormState({
                      ...formState,
                      quantity: value,
                    });
                  }
                }}
                min={1}
                status={errMessage.quantity && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.quantity}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductGiftPromotion;
