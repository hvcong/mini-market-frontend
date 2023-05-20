import React, { useEffect, useState } from "react";
import { Input, InputNumber } from "antd";
import { Typography } from "antd";
import { GiftOutlined } from "@ant-design/icons";
import UnitTypeSelectByProductId from "./UnitTypeSelectByProductId";
import ProductIdSelect from "./ProductIdSelect";
import productApi from "../../api/productApi";

const ProductGiftPromotion = ({
  formState = {},
  setFormState,
  errMessage = {},
  modalType,
  disabledInput,
}) => {
  const [productName1, setProductName1] = useState("");
  const [productName2, setProductName2] = useState("");

  useEffect(() => {
    if (formState.productId1) {
      getProductById1(formState.productId1);
    }
    if (formState.productId2) {
      getProductById2(formState.productId2);
    }
    return () => {};
  }, [formState.productId1, formState.productId2]);

  async function getProductById1(id) {
    let res = await productApi.findOneById(id);
    if (res.isSuccess) {
      setProductName1(res.product.name);
    }
  }
  async function getProductById2(id) {
    let res = await productApi.findOneById(id);
    if (res.isSuccess) {
      setProductName2(res.product.name);
    }
  }

  return (
    <>
      <Typography.Title level={5} className="promotion_line_form_bottom_title">
        Mua sản phẩm tặng sản phẩm (SP)
      </Typography.Title>
      <div className="promotion_line_form_bottom">
        <div className="promotion_line_form_bottom_left promotion_line_form_bottom_item_gift">
          <Typography.Title
            level={5}
            className="promotion_line_form_bottom_title"
          >
            SP mua
          </Typography.Title>
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">Mã SP</div>
            <div className="promotion_line_form_input_wrap">
              <ProductIdSelect
                className="promotion_line_form_input"
                size="small"
                value={formState.productId1}
                disabled={disabledInput("productId")}
                onChange={(value) => {
                  //console.log(value);
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
            <div className="promotion_line_form_label">Tên SP</div>
            <div className="promotion_line_form_input_wrap">
              <div className="promotion_line_form_input">{productName1}</div>
            </div>
          </div>
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">Đơn vị tính </div>
            <div className="promotion_line_form_input_wrap">
              <UnitTypeSelectByProductId
                className="promotion_line_form_input"
                size="small"
                disabled={disabledInput("utId")}
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
                disabled={disabledInput("minQuantity")}
                value={formState.minQuantity}
                onChange={(value) => {
                  if (value) {
                    setFormState({
                      ...formState,
                      minQuantity: value,
                    });
                  }
                }}
                min={1}
                status={errMessage.minQuantity && "error"}
              />
              <div className="promotion_line_form_input_err">
                {errMessage.minQuantity}
              </div>
            </div>
          </div>
        </div>
        <div className="promotion_line_form_bottom_right promotion_line_form_bottom_item_gift">
          <Typography.Title
            level={5}
            className="promotion_line_form_bottom_title"
          >
            SP tặng
          </Typography.Title>
          <div className="promotion_line_form_group">
            <div className="promotion_line_form_label">
              <GiftOutlined /> Mã SP
            </div>
            <div className="promotion_line_form_input_wrap">
              <ProductIdSelect
                className="promotion_line_form_input"
                size="small"
                disabled={disabledInput("productId")}
                value={formState.productId2}
                onChange={(value) => {
                  //console.log(value);
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
              <GiftOutlined /> Tên SP
            </div>
            <div className="promotion_line_form_input_wrap">
              <div className="promotion_line_form_input">{productName2}</div>
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
                disabled={disabledInput("utId")}
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
              <GiftOutlined /> Số lượng
            </div>
            <div className="promotion_line_form_input_wrap">
              <InputNumber
                className="promotion_line_form_input"
                size="small"
                disabled={disabledInput("quantity")}
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
