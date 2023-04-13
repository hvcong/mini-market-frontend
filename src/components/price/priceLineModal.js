import React, { useEffect, useRef, useState } from "react";

import {
  Modal,
  Button,
  Cascader,
  DatePicker,
  Form,
  Radio,
  Select,
  Switch,
  TreeSelect,
  Input,
  Row,
  Col,
  Typography,
  Space,
  InputNumber,
  Divider,
  Table,
  message,
} from "antd";
import ModalCustomer from "../ModalCustomer";
import unitTypeApi from "./../../api/unitTypeApi";
import { useDispatch, useSelector } from "react-redux";
import { setRefreshUnitType } from "../../store/slices/unitTypeSlice";
import ProductIdSelect from "../promotion/ProductIdSelect";
import UnitTypeSelectByProductId from "../promotion/UnitTypeSelectByProductId";
import productApi from "../../api/productApi";
import priceLineApi from "../../api/priceLineApi";
import { setRefreshPriceLines } from "../../store/slices/priceLineSlice";
import priceHeaderApi from "./../../api/priceHeaderApi";
import { compareDMY } from "../../utils";

const initFormState = {
  productId: "",
  utId: "",
  price: 0,
};
const initErrMessage = {};

const PriceLineModal = ({
  modalState,
  setModalState,
  headerPriceId,
  disabledItem,
}) => {
  let hideLoading = null;
  const { priceLines, refresh } = useSelector((state) => state.priceLine);
  const dispatch = useDispatch();
  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);

  useEffect(() => {
    let { type, rowSelected, visible } = modalState;
    if (visible && type == "create") {
      loadOneHeaderById(headerPriceId);
    } else if (rowSelected && visible) {
      loadOneHeaderById(headerPriceId, rowSelected);
    }

    return () => {};
  }, [modalState, headerPriceId]);

  async function loadOneHeaderById(headerId, rowSelected) {
    let res = await priceHeaderApi.getOneById(headerId);
    if (res.isSuccess) {
      let header = res.header || {};
      if (rowSelected) {
        setFormState({
          price: rowSelected.price,
          productId: rowSelected.ProductUnitType.ProductId,
          utId: rowSelected.ProductUnitType.UnitTypeId,
          ListPricesHeader: header,
        });
      } else {
        setFormState({
          price: 0,
          productId: "",
          utId: "",
          ListPricesHeader: header,
        });
      }
    }
  }

  function closeModal() {
    setModalState({
      visible: false,
    });
    clearModal();
  }

  function clearModal() {
    setErrMessage(initErrMessage);
    setFormState({
      ...formState,
      productId: "",
      utId: "",
      price: 0,
    });
  }

  async function onSubmit(type, isClose) {
    setErrMessage({});
    let formData = {};
    let putId;

    if (await checkData()) {
      putId = await getPUTid(formState.productId, formState.utId);
      formData = {
        price: formState.price,
        productUnitTypeId: putId,
        headerId: headerPriceId,
      };
      let res = {};
      if (type == "create") {
        // create
        hideLoading = message.loading("Đang tạo mới...", 0);
        res = await priceLineApi.addOne(formData);
        if (res.isSuccess) {
          message.info("Thêm mới dòng giá thành công");
          dispatch(setRefreshPriceLines());
          if (isClose) {
            closeModal();
          } else {
            clearModal();
          }
        } else {
          message.error("Có lỗi xảy, vui lòng thử lại!");
        }
      } else {
        // update
        hideLoading = message.loading("Đang cập nhật thay đổi...", 0);
        res = await priceLineApi.updateOne(modalState.rowSelected.id, formData);
        if (res.isSuccess) {
          hideLoading();
          dispatch(setRefreshPriceLines());
          closeModal();
        } else {
          message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      }
    }

    if (hideLoading) {
      hideLoading();
    }

    async function checkData() {
      let isCheck = true;
      let _errMess = {};

      if (!formState.productId) {
        _errMess.productId = "Không được bỏ trống";
      }

      if (!formState.utId) {
        _errMess.utId = "Không được bỏ trống";
      }

      if (type == "create") {
        if (formState.productId && formState.utId) {
          let putId = await getPUTid(formState.productId, formState.utId);
          priceLines.map((item) => {
            if (item.ProductUnitTypeId == putId) {
              isCheck = false;
              message.error("Sản phẩm và đơn vị đã tồn tại trong bảng này");
            }
          });
        }
      }
      Object.keys(_errMess).map((key) => {
        if (_errMess[key]) {
          isCheck = false;
        }
      });

      setErrMessage(_errMess);
      return isCheck;
    }
  }

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, [modalState.visible]);

  async function getPUTid(productId, utId) {
    let res = await productApi.findOneById(productId);
    if (!res.isSuccess) {
      return;
    }

    let putId = res.product.ProductUnitTypes.filter(
      (item) => item.UnitTypeId == utId
    )[0].id;
    return putId;
  }

  return (
    <div className="price_line_modal">
      <ModalCustomer
        visible={modalState.visible}
        style={{
          width: "380px",
        }}
        closeModal={() => {
          setModalState({
            visible: false,
          });
        }}
      >
        <div>
          <div className="title__container">
            <Typography.Title level={4} className="title">
              {modalState.type == "update"
                ? "Cập nhật thông tin một đơn giá"
                : "Thêm mới đơn giá"}
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="price_line_form">
              <div className="price_line_form_group">
                <div className="price_line_form_label">Mã sản phẩm</div>
                <div className="price_line_form_input_wrap">
                  <ProductIdSelect
                    className="price_line_form_input"
                    size="small"
                    value={formState.productId}
                    onChange={(value) => {
                      setFormState({
                        ...formState,
                        utId: "",
                        productId: value,
                      });
                    }}
                    status={errMessage.productId && "error"}
                    disabled={disabledItem("productId", modalState.type)}
                  />
                  <div className="price_line_form_input_err">
                    {errMessage.productId}
                  </div>
                </div>
              </div>

              <div className="price_line_form_group">
                <div className="price_line_form_label">Đơn vị tính </div>
                <div className="price_line_form_input_wrap">
                  <UnitTypeSelectByProductId
                    className="price_line_form_input"
                    size="small"
                    value={formState.utId}
                    productId={formState.productId}
                    onChange={(value) => {
                      setFormState({
                        ...formState,
                        utId: value,
                      });
                    }}
                    status={errMessage.utId && "error"}
                    disabled={
                      disabledItem("utId", modalState.type) ||
                      !formState.productId
                    }
                  />
                  <div className="price_line_form_input_err">
                    {errMessage.utId}
                  </div>
                </div>
              </div>
              <div className="price_line_form_group">
                <div className="price_line_form_label">Giá</div>
                <div className="price_line_form_input_wrap">
                  <InputNumber
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    className="price_line_form_input"
                    size="small"
                    value={formState.price}
                    onChange={(value) => {
                      if (value || value == 0) {
                        setFormState({
                          ...formState,
                          price: value,
                        });
                      }
                    }}
                    min={0}
                    status={errMessage.price && "error"}
                    disabled={disabledItem("price")}
                  />
                  <div className="price_line_form_input_err">
                    {errMessage.price}
                  </div>
                </div>
              </div>
            </div>
            <Space
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {modalState.type == "create" ? (
                <>
                  <Button
                    type="primary"
                    onClick={() => {
                      onSubmit("create");
                    }}
                  >
                    Lưu & Thêm mới
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      onSubmit("create", true);
                    }}
                  >
                    Lưu & Đóng
                  </Button>
                </>
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    onSubmit("update", true);
                  }}
                >
                  Cập nhật
                </Button>
              )}
              <Button type="primary" danger onClick={closeModal}>
                Hủy bỏ
              </Button>
            </Space>
          </div>
        </div>
      </ModalCustomer>
    </div>
  );
};

export default PriceLineModal;
