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
import { useDispatch } from "react-redux";
import { setRefreshUnitType } from "../../store/slices/unitTypeSlice";
import ProductIdSelect from "../promotion/ProductIdSelect";
import UnitTypeSelectByProductId from "../promotion/UnitTypeSelectByProductId";
import productApi from "../../api/productApi";
import priceLineApi from "../../api/priceLineApi";
import { setRefreshPriceLines } from "../../store/slices/priceLineSlice";

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
  startDateHeader,
  endDateHeader,
}) => {
  let hideLoading = null;
  const dispatch = useDispatch();
  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);

  useEffect(() => {
    let { type, rowSelected, visible } = modalState;
    if (type && rowSelected && visible) {
      setFormState({
        startDate: rowSelected.startDate,
        endDate: rowSelected.endDate,
        price: rowSelected.price,
        productId: rowSelected.ProductUnitType.ProductId,
        utId: rowSelected.ProductUnitType.UnitTypeId,
      });
    }

    return () => {};
  }, [modalState]);

  function closeModal() {
    setModalState({
      visible: false,
    });
    clearModal();
  }

  function clearModal() {
    setErrMessage(initErrMessage);
    setFormState(initFormState);
  }

  async function onSubmit(type, isClose) {
    setErrMessage({});
    let formData = {};
    let putId;

    if (await checkData()) {
      formData = {
        price: formState.price,
        productUnitTypeId: putId,
        headerId: headerPriceId,
        startDate: startDateHeader,
        endDate: endDateHeader,
        state: formState.state,
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

      if (formState.productId && formState.productId) {
        // get putId
        let res = await productApi.findOneById(formState.productId);
        if (res.isSuccess) {
          res.product.ProductUnitTypes.map((put) => {
            if (put.UnitTypeId == formState.utId) {
              putId = put.id;
            }
          });

          if (!putId) {
            _errMess.utId = "Không được bỏ trống!.";
          }
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

  return (
    <div className="price_line_modal">
      <ModalCustomer
        visible={modalState.visible}
        style={{
          width: "380px",
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
                        productId: value,
                      });
                    }}
                    status={errMessage.productId && "error"}
                    disabled={modalState.type == "update"}
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
                    disabled={modalState.type == "update"}
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
                    disabled={modalState.type == "update"}
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
