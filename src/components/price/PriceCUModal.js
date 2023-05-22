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
import {
  CloseOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import priceHeaderApi from "../../api/priceHeaderApi";
import { setRefreshPriceHeaders } from "../../store/slices/priceHeaderSlice";
import PriceLineTable from "./PriceLineTable";
import DatePickerCustom from "../promotion/DatePickerCustom";
import dayjs from "dayjs";
import { antdToDmy, antdToYmd, compareDMY, sqlToAntd } from "../../utils";
import productApi from "./../../api/productApi";
import { current } from "@reduxjs/toolkit";
const { Text } = Typography;

const initFormState = {
  id: "",
  title: "",
  startDate: "",
  endDate: "",
  state: false,
  Prices: [],
};

const initErrMessage = {};

const ddMMyyyy = "DD/MM/YYYY";

const PriceCUModal = ({ modalState, setModalState, handleOnChangeState }) => {
  let hideLoading = null;
  const dispatch = useDispatch();

  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);

  function onCloseModal() {
    clearModal();
    setModalState({
      visible: false,
      type: "",
    });
  }

  useEffect(() => {
    let { type, visible, rowSelected } = modalState;

    if (type && visible && rowSelected) {
      loadOneHeaderById(rowSelected.id);
    }

    if (type == "create" && visible) {
      let now = new Date();

      setFormState({
        ...formState,
        startDate: now.setDate(now.getDate() + 1),
        endDate: now.setDate(now.getDate() + 1),
      });
    }
    return () => {};
  }, [modalState]);

  async function loadOneHeaderById(id) {
    let res = await priceHeaderApi.getOneById(id);
    if (res.isSuccess) {
      let header = res.header;

      setFormState(header);
    }
  }

  function clearModal() {
    setFormState(initFormState);
    setErrMessage({});
  }

  // on submit create/update header
  async function onSubmit(type, isClose) {
    setErrMessage({});
    if (await isCheckData()) {
      let formData = {};
      let res = {};
      formData = {
        id: formState.id,
        title: formState.title,
        startDate: formState.startDate,
        endDate: formState.endDate,
        state: formState.state,
      };
      if (type == "create") {
        hideLoading = message.loading("Đang tạo mới...", 0);
        res = await priceHeaderApi.addOne(formData);

        if (res.isSuccess) {
          message.info("Thêm mới thành công");
          dispatch(setRefreshPriceHeaders());
          if (isClose) {
            onCloseModal();
          } else {
            setModalState({
              visible: true,
              type: "update",
              rowSelected: res.header,
            });
          }
        } else {
          message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      } else {
        // update
        hideLoading = message.loading("Đang cập nhật thay đổi...", 0);

        res = await priceHeaderApi.updateOne(formData);
        if (res.isSuccess) {
          message.info("Cập nhật thành công!");
          dispatch(setRefreshPriceHeaders());
          onCloseModal();
        } else {
          message.info("Có lỗi xảy ra, vui lòng thử lại!");
        }
      }
    }

    if (hideLoading) {
      hideLoading();
    }

    async function isCheckData() {
      let isCheck = true;
      let _errMess = {};

      if (!formState.id) {
        _errMess.id = "Không được bỏ trống!";
      } else {
        if (type == "create") {
          let res = await priceHeaderApi.getOneById(formState.id);
          if (res.isSuccess) {
            _errMess.id = "Mã đã được sử dụng trước đó!";
          }
        }
      }

      if (!formState.title) {
        _errMess.title = "Không được bỏ trống!";
      }

      if (!formState.startDate) {
        _errMess.startDate = "Không được bỏ trống!";
      }

      if (!formState.endDate) {
        _errMess.endDate = "Không được bỏ trống!";
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

  // close hideloading
  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, []);

  function disableChangeState(startDate, endDate) {
    if (startDate && endDate) {
      let start = new Date(startDate);
      let end = new Date(endDate);
      let now = new Date();

      // đã quá hạn
      if (compareDMY(end, now) < 0) {
        return true;
      }
    }
    return false;
  }

  function disableAddNewPriceLine(startDate, endDate, state) {
    if (state) {
      return true;
    }
    if (startDate && endDate) {
      let start = new Date(startDate);
      let end = new Date(endDate);
      let now = new Date();

      // đã quá hạn
      if (compareDMY(end, now) < 0) {
        return true;
      }

      // đã và đang sử dụng
      if (compareDMY(start, now) <= 0 && compareDMY(end, now) == 1) {
        return true;
      }
    }

    return false;
  }

  async function handleOnChangeStartDate(string) {
    if (modalState.type == "create") {
      setFormState({
        ...formState,
        startDate: string,
        endDate: "",
        state: false,
      });
    } else {
      // update
      if (string) {
        let start = new Date(string);
        let end = new Date(formState.endDate);
        let now = new Date();

        if (compareDMY(start, now) <= 0) {
          message.error("Ngày bắt đầu phải lớn hơn ngày hiện tại!");
          return;
        }

        if (compareDMY(start, end) > 0) {
          message.error("Ngày bắt đầu phải bé hơn hoặc bằng ngày kết thúc!");
          return;
        }

        // oke

        let res = await priceHeaderApi.updateOne({
          id: formState.id,
          startDate: start,
        });
        if (res.isSuccess) {
          dispatch(setRefreshPriceHeaders());
          setFormState({
            ...formState,
            startDate: string,
          });
        }
      }
    }
  }

  function disableStartDate() {
    if (
      modalState.type == "update" &&
      formState.startDate &&
      formState.endDate
    ) {
      if (formState.state) {
        return true;
      }

      let now = new Date();
      let start = new Date(formState.startDate);
      let end = new Date(formState.endDate);

      // start <= now ko được chỉnh sửa
      if (compareDMY(start, now) <= 0) {
        return true;
      }
    }
  }

  function disValueStartDate(val) {
    let now = new Date();
    let value = new Date(antdToYmd(val));
    let isDisable = false;
    let end = new Date(formState.endDate);

    if (modalState.type == "update") {
      isDisable = compareDMY(value, end) > 0 || compareDMY(value, now) <= 0;
    } else {
      isDisable = compareDMY(value, now) <= 0;
    }

    return isDisable;
  }

  function disableEndDate() {
    if (modalState.type == "create") {
      if (!formState.startDate) {
        return true;
      }
    } else {
      // when update
      if (formState.state) {
        return true;
      }

      if (formState.startDate && formState.endDate) {
        let start = new Date(formState.startDate);
        let end = new Date(formState.endDate);
        let now = new Date();

        // nếu đang sử dụng thì ko đc chỉnh sửa
        if (
          compareDMY(start, now) <= 0 &&
          compareDMY(end, now) >= 0 &&
          formState.state
        ) {
          return true;
        }

        // nếu end < now thì ko được
        if (compareDMY(end, now) < 0) {
          return true;
        }
      }
    }
  }

  function disValueEndDate(val) {
    let isDisable = false;

    if (formState.startDate) {
      let st = new Date(formState.startDate);
      let now = new Date();
      let value = "";
      try {
        value = new Date(antdToYmd(val));
      } catch (ex) {
        //console.log("exception");
      }
      if (value) {
        if (modalState.type == "create") {
          isDisable = compareDMY(value, st) < 0;
        } else {
          isDisable = compareDMY(value, st) < 0 || compareDMY(value, now) < 0;
        }
      }
    }
    return isDisable;
  }

  async function handleOnChangeEndDate(string) {
    if (string) {
      let start = new Date(formState.startDate);
      let end = new Date(string);
      let now = new Date();
      if (compareDMY(end, start) < 0) {
        message.error("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu!");
        return;
      }

      if (compareDMY(end, now) < 0) {
        message.error("Ngày kết thúc phải lớn hơn ngày hiện tại!");
        return;
      }

      if (modalState.type == "update") {
        let res = await priceHeaderApi.updateOne({
          id: formState.id,
          endDate: end,
        });
        if (res.isSuccess) {
          dispatch(setRefreshPriceHeaders());
          setFormState({
            ...formState,
            endDate: string,
          });
        }
      } else {
        setFormState({
          ...formState,
          endDate: string,
        });
      }
    }
  }

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

  function disabledItem(name, typeModalItem) {
    if (modalState.type == "view") return true;

    if (name == "startDate") {
      return disableStartDate();
    }

    if (name == "endDate") {
      return disableEndDate();
    }

    if (name == "state") {
      return disableChangeState(formState.startDate, formState.endDate);
    }

    if (modalState.type == "update") {
      let start = new Date(formState.startDate);
      let end = new Date(formState.endDate);
      let now = new Date();

      if (formState.state) {
        return true;
      }

      if (name == "productId") {
        if (typeModalItem == "update") return true;
      }
      if (name == "utId") {
        if (typeModalItem == "update") return true;
      }

      // đã hết hạn
      if (compareDMY(end, now) < 0) {
        return true;
      }

      // đang sử dụng
      if (compareDMY(start, now) <= 0) {
        return true;
      }

      // tương lai
      if (compareDMY(start, now) > 0) {
        return false;
      }
    }

    if (modalState.type == "create") {
    }
  }

  return (
    <div className="price__modal">
      <ModalCustomer
        visible={modalState.visible}
        style={{
          width: "96%",
        }}
        closeModal={() => {
          onCloseModal();
        }}
      >
        <div>
          <div className="title__container">
            <Typography.Title level={4} className="title">
              {modalState.type == "update" && "Cập nhật thông tin bảng giá"}
              {modalState.type == "create" && "Tạo mới bảng giá"}
              {modalState.type == "view" && "Xem thông tin bảng giá"}
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="infor__input">
              <div className="input__container">
                <Text className="input__label">Mã</Text>
                <div className="input_wrap">
                  <Input
                    placeholder="Mã"
                    size="small"
                    style={{
                      width: "150px",
                    }}
                    value={formState.id}
                    onChange={({ target }) =>
                      setFormState({ ...formState, id: target.value })
                    }
                    status={errMessage.id && "error"}
                    disabled={disabledItem("id")}
                  />
                  <div className="input_err">{errMessage.id}</div>
                </div>
              </div>
              <div className="input__container">
                <Text className="input__label">Tiêu đề</Text>
                <div className="input_wrap">
                  <Input
                    placeholder="Tên"
                    size="small"
                    style={{
                      width: "300px",
                    }}
                    value={formState.title}
                    onChange={({ target }) =>
                      setFormState({ ...formState, title: target.value })
                    }
                    status={errMessage.title && "error"}
                    disabled={disabledItem("name")}
                  />
                  <div className="input_err">{errMessage.title}</div>
                </div>
              </div>

              <div className="input__container">
                <Text className="input__label">Ngày bắt đầu</Text>
                <div className="input_wrap">
                  <DatePicker
                    size="small"
                    value={
                      formState.startDate && sqlToAntd(formState.startDate)
                    }
                    onChange={(_, string) => {
                      handleOnChangeStartDate(string);
                    }}
                    disabledDate={disValueStartDate}
                    disabled={disabledItem("startDate")}
                    status={errMessage.startDate && "error"}
                  />

                  <div className="input_err">{errMessage.startDate}</div>
                </div>
              </div>
              <div className="input__container">
                <Text className="input__label">Ngày kết thúc</Text>
                <div className="input_wrap">
                  <DatePicker
                    size="small"
                    value={formState.endDate && sqlToAntd(formState.endDate)}
                    disabled={disabledItem("endDate")}
                    onChange={(_, string) => {
                      handleOnChangeEndDate(string);
                    }}
                    disabledDate={disValueEndDate}
                    status={errMessage.endDate && "error"}
                  />

                  <div className="input_err">{errMessage.endDate}</div>
                </div>
              </div>
              {modalState.type == "update" && (
                <div className="input__container">
                  <Text className="input__label">Trạng thái</Text>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    checked={formState.state}
                    onChange={async (is) => {
                      let result = await handleOnChangeState(is, formState.id);
                      if (result) {
                        dispatch(
                          setFormState({
                            ...formState,
                            state: is,
                          })
                        );
                      }
                    }}
                    disabled={disabledItem("state")}
                  />
                </div>
              )}

              {modalState.type == "create" && (
                <div className="input__container">
                  <Text className="input__label">Trạng thái</Text>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    onChange={(is) => {
                      setFormState({
                        ...formState,
                        state: is,
                      });
                    }}
                  />
                </div>
              )}
            </div>
            {modalState.type != "create" && (
              <PriceLineTable
                headerPriceId={formState.id}
                startDateHeader={formState.startDate}
                endDateHeader={formState.endDate}
                isDisabledAddButton={disableAddNewPriceLine(
                  formState.startDate,
                  formState.endDate,
                  formState.state
                )}
                disabledItem={disabledItem}
                headerState={formState.state}
              />
            )}

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
                      onSubmit("create", false);
                    }}
                  >
                    Lưu & Thêm mới các dòng giá sản phẩm
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
                    onSubmit("update");
                  }}
                >
                  Cập nhật
                </Button>
              )}
              <Button type="primary" danger onClick={onCloseModal}>
                Hủy bỏ
              </Button>
            </Space>
          </div>
        </div>
      </ModalCustomer>
    </div>
  );
};

export default PriceCUModal;
