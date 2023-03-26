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
import { compareDMY } from "../../utils";
import productApi from "./../../api/productApi";
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
      loadOneHeaderById(rowSelected.id);
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

  async function handleOnChangeState(is) {
    if (modalState.type == "create") {
      // to active
      if (is) {
        if (!formState.startDate || !formState.endDate) {
          message.error("Vui lòng chọn ngày bắt đầu và kết thúc trước!");
          return;
        }

        // khi tạo ngày bắt đầu phải == now mới được active
        let now = new Date();
        let start = new Date(formState.startDate);

        let result = compareDMY(now, start);

        if (result >= 0) {
          setFormState({
            ...formState,
            state: is,
          });
        } else {
          message.error("Ngày bắt đầu phải bé hơn hoặc bằng ngày hiện tại!");
        }
      } else {
        setFormState({
          ...formState,
          state: is,
        });
      }
    }

    if (modalState.type == "update") {
      /**
       * To active
       * - kiểm tra thời gian ( start <= now && end > now)
       * - kiểm tra trùng priceline
       */

      if (is) {
        let isCheck = true;
        let start = formState.startDate;
        let end = formState.endDate;

        if (compareDMY(new Date(start), new Date()) > 0) {
          isCheck = false;
          message.error("Ngày bắt đầu phải bé hơn hoặc bằng ngày hiện tại!");
        }

        if (compareDMY(new Date(end), new Date()) < 1) {
          isCheck = false;
          message.error("Ngày kết thúc phải lớn hơn ngày hiện tại!");
        }

        // kiểm tra trùng
        let res = await priceHeaderApi.getAllOnActive();

        let isExist = false;
        if (res.isSuccess) {
          let headers = res.headers || [];
          // loop through each header
          for (const header of headers) {
            // loop through each line in a header
            let priceLines = header.Prices || [];

            for (const line of priceLines) {
              console.log(priceLines);
              for (const _lineThisHeader of formState.Prices || []) {
                if (
                  _lineThisHeader.ProductUnitTypeId == line.ProductUnitTypeId
                ) {
                  isExist = true;
                  isCheck = false;
                  message.error(
                    `Sản phẩm "${line.ProductUnitType.Product.name} với đơn vị ${line.ProductUnitType.UnitType.name}" đang được bán ở bảng ${header.title} `
                  );
                }
              }
            }
          }
        }

        if (isCheck) {
          // to active header
          let res = await priceHeaderApi.updateOne({
            id: formState.id,
            state: true,
          });

          if (res.isSuccess) {
            setFormState({
              ...formState,
              state: true,
            });
            message.info("Áp dụng bảng giá thành công");
            dispatch(setRefreshPriceHeaders());
          }
        }
      } else {
        let res = await priceHeaderApi.updateOne({
          id: formState.id,
          state: false,
        });

        if (res.isSuccess) {
          setFormState({
            ...formState,
            state: false,
          });
          message.info("Tạm dừng bảng giá thành công");
          dispatch(setRefreshPriceHeaders());
        }
      }
    }
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
        if (compareDMY(start, new Date()) >= 0 && compareDMY(start, end) < 0) {
          message.info("lon hon");

          // oke
          let res = await priceHeaderApi.updateOne({
            id: formState.id,
            startDate: string,
          });
          if (res.isSuccess) {
            setFormState({
              ...formState,
              startDate: string,
            });
          }
        }
      }
    }
  }

  function disabledStartDate() {
    if (modalState.type == "update") {
      // đang active thì ko đc chỉnh ngày bắt đầu
      if (formState.state) {
        return true;
      }

      // ko active

      let start = formState.startDate;
      if (compareDMY(new Date(start), new Date()) < 0) {
        return true;
      }

      // đang ko active
    }
  }

  function disableEndDate() {
    if (modalState.type == "create") {
      if (!formState.startDate) {
        return true;
      }
    } else {
      // when update
    }
  }

  async function handleOnChangeEndDate(string) {
    let st = new Date(formState.startDate);
    let now = new Date();
    if (string) {
      if (compareDMY(st, new Date(string)) >= 0) {
        message.error("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
        return;
      }

      if (compareDMY(new Date(string), now) <= 0) {
        message.error("Ngày kết thúc phải lớn hơn ngày hiện tại!");
        return;
      }

      // oke when update
      if (modalState.type == "update") {
        let res = await priceHeaderApi.updateOne({
          id: formState.id,
          endDate: string,
        });
      }
      setFormState({
        ...formState,
        endDate: string,
      });
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

  return (
    <div className="price__modal">
      <ModalCustomer
        visible={modalState.visible}
        style={{
          width: "96%",
        }}
      >
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
                <Text className="input__label">Ngày bắt đầu</Text>
                <div className="input_wrap">
                  <DatePicker
                    size="small"
                    value={
                      formState.startDate &&
                      dayjs(formState.startDate, "YYYY-MM-DD")
                    }
                    onChange={(_, string) => {
                      handleOnChangeStartDate(string);
                    }}
                    disabledDate={(current) => {
                      let now = new Date();
                      if (modalState.type == "update") {
                        let end = new Date(formState.endDate);
                        end.setDate(end.getDate() - 1);
                        return (
                          (current &&
                            current < dayjs(now.setDate(now.getDate() - 1))) ||
                          (current && current >= dayjs(end))
                        );
                      }
                      return (
                        current &&
                        current < dayjs(now.setDate(now.getDate() - 1))
                      );
                    }}
                    disabled={disabledStartDate()}
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
                    value={
                      formState.endDate &&
                      dayjs(formState.endDate, "YYYY-MM-DD")
                    }
                    disabled={disableEndDate()}
                    onChange={(_, string) => {
                      handleOnChangeEndDate(string);
                    }}
                    disabledDate={(current) => {
                      let isDisable = false;

                      if (modalState.type == "create") {
                        let st = new Date(formState.startDate);
                        isDisable = current <= dayjs(st.setDate(st.getDate()));
                      } else {
                        let st = new Date(formState.startDate);
                        isDisable =
                          current <= dayjs(st.setDate(st.getDate())) ||
                          current <= dayjs(new Date());
                      }

                      return isDisable;
                    }}
                    status={errMessage.endDate && "error"}
                  />

                  <div className="input_err">{errMessage.endDate}</div>
                </div>
              </div>
              <div className="input__container">
                <Text className="input__label">Trạng thái</Text>
                <Switch
                  checkedChildren="On"
                  unCheckedChildren="Off"
                  checked={formState.state}
                  onChange={handleOnChangeState}
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
