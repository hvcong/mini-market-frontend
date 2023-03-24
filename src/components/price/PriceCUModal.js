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
const { Text } = Typography;

const initFormState = {
  id: "",
  title: "",
  startDate: "",
  endDate: "",
  state: true,
};

const initErrMessage = {};

const ddMMyyyy = "DD/MM/YYYY";

const PriceCUModal = ({ modalState, setModalState }) => {
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
      setFormState({
        ...rowSelected,
      });
    }
    return () => {};
  }, [modalState]);

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

      if (!formState.startDate || !formState.endDate) {
        _errMess.time = "Không được bỏ trống!";
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

  return (
    <div className="price__modal">
      <ModalCustomer visible={modalState.visible}>
        <div>
          <div className="title__container">
            <Typography.Title level={4} className="title">
              {modalState.type == "update"
                ? "Cập nhật thông tin bảng giá"
                : "Thêm mới bảng giá"}
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
                    disabled={modalState.type == "update"}
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
                  />
                  <div className="input_err">{errMessage.title}</div>
                </div>
              </div>
              <div className="input__container">
                <Text className="input__label">Thời gian</Text>
                <div className="input_wrap">
                  <DatePickerCustom
                    size="small"
                    value={[formState.startDate, formState.endDate]}
                    onChangeDate={(strings) => {
                      setFormState({
                        ...formState,
                        startDate: strings[0],
                        endDate: strings[1],
                      });
                    }}
                    status={errMessage.time && "error"}
                  />

                  <div className="input_err">{errMessage.time}</div>
                </div>
              </div>
              <div className="input__container">
                <Text className="input__label">Trạng thái</Text>
                <Switch
                  checkedChildren="On"
                  unCheckedChildren="Off"
                  checked={formState.state}
                  onChange={(is) =>
                    setFormState({
                      ...formState,
                      state: is,
                    })
                  }
                />
              </div>
            </div>
            {modalState.type == "update" && (
              <PriceLineTable
                headerPriceId={formState.id}
                startDateHeader={formState.startDate}
                endDateHeader={formState.endDate}
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
