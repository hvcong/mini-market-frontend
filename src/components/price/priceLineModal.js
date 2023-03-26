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
import priceHeaderApi from "./../../api/priceHeaderApi";
import { compareDMY } from "../../utils";

const initFormState = {
  productId: "",
  utId: "",
  price: 0,
};
const initErrMessage = {};

const PriceLineModal = ({ modalState, setModalState, headerPriceId }) => {
  let hideLoading = null;
  const dispatch = useDispatch();
  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);

  useEffect(() => {
    let { type, rowSelected, visible } = modalState;
    if (type == "update" && rowSelected && visible) {
      setFormState({
        price: rowSelected.price,
        productId: rowSelected.ProductUnitType.ProductId,
        utId: rowSelected.ProductUnitType.UnitTypeId,
        ListPricesHeader: rowSelected.ListPricesHeader,
      });
    } else if (visible && type == "create") {
      loadOneHeaderById(headerPriceId);
    }

    return () => {};
  }, [modalState]);

  async function loadOneHeaderById(headerId) {
    let res = await priceHeaderApi.getOneById(headerId);
    if (res.isSuccess) {
      let header = res.header || {};
      setFormState({
        price: 0,
        productId: "",
        utId: "",
        ListPricesHeader: header,
      });
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
    console.log(formState);

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

      // thêm vào bảng giá đang active

      if (
        formState.productId &&
        formState.utId &&
        formState.ListPricesHeader.state
      ) {
        // kiểm tra xem đã có trong bảng bảng active hay chưa
        let res = await priceHeaderApi.getAllOnActive();
        let putId = await getPUTid(formState.productId, formState.utId);
        let isExist = false;
        if (res.isSuccess) {
          let headers = res.headers || [];
          // loop through each header
          for (const header of headers) {
            // loop through each line in a header
            let priceLines = header.Prices || [];
            for (const line of priceLines) {
              if (line.ProductUnitTypeId == putId) {
                if (header.id == headerPriceId) {
                  message.error(
                    `Sản phẩm và đơn vị này đang sử dụng ở bảng giá này`
                  );
                } else {
                  message.error(
                    `Sản phẩm và đơn vị này đang sử dụng ở bảng giá "${header.title}"`
                  );
                }
                isExist = true;
                isCheck = false;
                break;
              }
            }
            if (isExist) {
              break;
            }
          }
        }
      }

      // thêm vào bảng giá chưa active
      if (
        formState.productId &&
        formState.utId &&
        !formState.ListPricesHeader.state
      ) {
        // kiểm tra xem đã nằm trong bảng này hay chưa
        let isExist = false;
        let putId = await getPUTid(formState.productId, formState.utId);
        console.log(putId);
        let res = await priceHeaderApi.getOneById(headerPriceId);
        if (res.isSuccess) {
          let header = res.header || {};
          let Prices = header.Prices || [];

          for (const line of Prices) {
            if (line.ProductUnitTypeId == putId) {
              isExist = true;
              isCheck = false;
              message.error("Sẩn phẩm với đơn vị đã tồn tại trong bảng này!");
              break;
            }
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

  function disabledUT() {
    if (formState.ListPricesHeader) {
      let start =
        formState.ListPricesHeader &&
        new Date(formState.ListPricesHeader.startDate);
      let end =
        formState.ListPricesHeader &&
        new Date(formState.ListPricesHeader.endDate);
      let state =
        formState.ListPricesHeader && formState.ListPricesHeader.state;
      let now = new Date();

      // đang hoạt động thì ko được chỉnh sửa
      if (modalState.type == "update" && state) {
        return true;
      }
      // ngày bắt đầu bé hơn ngày hiện tại thì disabled
      if (modalState.type == "update" && compareDMY(start, now) < 0) {
        return true;
      }
    }
  }

  function disabledProductId() {
    let start =
      formState.ListPricesHeader &&
      new Date(formState.ListPricesHeader.startDate);
    let end =
      formState.ListPricesHeader &&
      new Date(formState.ListPricesHeader.endDate);
    let state = formState.ListPricesHeader && formState.ListPricesHeader.state;
    let now = new Date();
    // đang hoạt động thì ko được chỉnh sửa
    if (modalState.type == "update" && state) {
      return true;
    }
    // ngày bắt đầu bé hơn ngày hiện tại thì disabled
    if (modalState.type == "update" && compareDMY(start, now) < 0) {
      return true;
    }
  }

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
                    disabled={disabledProductId()}
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
                    disabled={disabledUT()}
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
