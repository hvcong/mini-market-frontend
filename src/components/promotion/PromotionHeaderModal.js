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
  Upload,
} from "antd";
import ModalCustomer from "../ModalCustomer";
import { useDispatch } from "react-redux";
import ImageUpload from "./ImageUpload";
import DropSelectColum from "../product/DropSelectColum";
import { PlusOutlined } from "@ant-design/icons";
import PromotionLineTable from "./PromotionLineTable";
import DatePickerCustom from "./DatePickerCustom";
import promotionApi from "./../../api/promotionApi";
import CustomerGroupSelect from "./../customerGroup/CustomerGroupSelect";
import PromotionLineModal from "./PromotionLineModal";
import { setRefreshPromotionHeaders } from "../../store/slices/promotionHeaderSlice";
import { setRefreshPromotionLines } from "../../store/slices/promotionLineSlice";
import { antdToYmd, compareDMY, sqlToAntd } from "../../utils";
import dayjs from "dayjs";

const initFormState = {
  id: "",
  startDate: "",
  endDate: "",
  title: "",
  description: "",
  state: "",
  image: "",
  customerTypeIds: [],
};
const initErrMessage = {
  id: "",
  startDate: "",
  endDate: "",
  title: "",
  description: "",
  state: "",
  image: "",
  customerTypeIds: "",
};

const PromotionHeaderModal = ({
  modalState,
  setModalState,
  handleOnChangeState,
}) => {
  let hideLoading = null;
  const dispatch = useDispatch();

  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);
  const {
    id,
    startDate,
    endDate,
    title,
    description,
    state,
    image,
    customerTypeIds,
  } = formState;

  useEffect(() => {
    const { type, rowSelected, visible } = modalState;

    if (type == "update" && rowSelected && visible) {
      getOneHeaderById(rowSelected.id);
    }

    if (type == "create" && visible) {
      let now = new Date();
      now.setDate(now.getDate() + 1);

      setFormState({
        ...formState,
        startDate: now,
        endDate: now,
      });
    }

    return () => {};
  }, [modalState]);

  async function getOneHeaderById(id) {
    let res = await promotionApi.getOneHeaderById(id);
    if (res.isSuccess && res.promotion) {
      setFormState({
        ...res.promotion,
        customerTypeIds: res.promotion.TypeCustomers.map((item) => {
          return item.id;
        }),
      });
    }
  }

  async function onSubmit(type, isClose) {
    setErrMessage({});
    let formData = {
      id,
      startDate,
      endDate,
      title,
      description,
      state,
      image,
      customerIds: customerTypeIds.map((item) => {
        return {
          id: item,
        };
      }),
    };

    if (await checkData()) {
      let res = {};

      if (type == "create") {
        hideLoading = message.loading("Đang tạo mới...", 0);
        res = await promotionApi.addOneHeader(formData);
        if (res.isSuccess) {
          hideLoading();
          message.info("Thêm mới thành công", 3);
          dispatch(setRefreshPromotionHeaders());

          if (isClose) {
            closeModal();
          } else {
            setModalState({
              type: "update",
              visible: true,
              rowSelected: res.promotion,
            });
          }
        } else {
          hideLoading();
          message.error("Có lỗi xảy ra, vui lòng thử lại!", 3);
        }
      } else {
        // update

        formData = {
          title,
          state,
          description,
          startDate,
          endDate,
        };
        hideLoading = message.loading("Đang cập nhật...", 0);
        res = await promotionApi.updateOneHeader(id, formData);

        if (res.isSuccess) {
          hideLoading();
          message.info("Cập nhật thành công", 3);
          dispatch(setRefreshPromotionHeaders());
          dispatch(setRefreshPromotionLines());
        }
      }
    }

    if (hideLoading) {
      hideLoading();
    }

    async function checkData() {
      let isCheck = true;
      let _errMess = {};

      if (!id) {
        _errMess.id = "Không được bỏ trống!";
      } else {
        if (modalState.type == "create") {
          let res = await promotionApi.getOneHeaderById(id);
          if (res.isSuccess) {
            _errMess.id = "Mã đã tồn tại, vui lòng dùng mã khác!";
          }
        }
      }

      // name
      if (!title) {
        _errMess.title = "Không được bỏ trống!";
      }

      if (!startDate) {
        _errMess.time = "Không được bỏ trống!";
      }

      if (!endDate) {
        _errMess.time = "Không được bỏ trống!";
      }

      if (!customerTypeIds || customerTypeIds.length == 0) {
        _errMess.customerTypeIds = "Vui lòng chọn đối tượng khách hàng!";
      }

      Object.keys(_errMess).map((key) => {
        if (_errMess) {
          isCheck = false;
        }
      });
      setErrMessage(_errMess);
      return isCheck;
    }
  }

  function onChangeDate(strings = []) {
    if (strings.length > 1) {
      setFormState({
        ...formState,
        startDate: strings[0],
        endDate: strings[1],
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
    setFormState(initFormState);
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
          // oke
          let res = await promotionApi.updateOneHeader(formState.id, {
            startDate: string,
          });

          if (res.isSuccess) {
            dispatch(setRefreshPromotionHeaders());
            setFormState({
              ...formState,
              startDate: string,
            });
          }
        }
      }
    }
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
    }

    return false;
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
        console.log("exception");
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

      //oke when update
      if (modalState.type == "update") {
        let res = await promotionApi.updateOneHeader(formState.id, {
          endDate: string,
        });
        if (res.isSuccess) {
          dispatch(setRefreshPromotionHeaders());
          setFormState({
            ...formState,
            endDate: string,
          });
        }
      } else {
        // create
        setFormState({
          ...formState,
          endDate: string,
        });
      }
    }
  }

  function disabledChangeHeaderState() {
    if (formState.startDate && formState.endDate) {
      let start = new Date(formState.startDate);
      let end = new Date(formState.endDate);
      let now = new Date();

      // đã hết hạn
      if (compareDMY(end, now) < 0) {
        return true;
      }
    }
    return false;
  }

  return (
    <div className="promotion_header_modal">
      <ModalCustomer
        visible={modalState.visible}
        style={{
          width: "90%",
        }}
      >
        <div>
          <div className="title__container">
            <Typography.Title level={4} className="title">
              {modalState.type == "update"
                ? "Cập nhật thông tin chương trình khuyến mãi"
                : "Thêm mới chương trình khuyến mãi"}
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="promotion_header_form">
              <div className="promotion_header_form_top">
                {/* <div className="promotion_header_form_first">
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_input_wrap">
                      <ImageUpload />
                      <div className="promotion_header_form_input_err"></div>
                    </div>
                  </div>
                </div> */}
                <div className="promotion_header_form_left">
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_label">Mã CTKM</div>
                    <div className="promotion_header_form_input_wrap">
                      <Input
                        className="promotion_header_form_input"
                        size="small"
                        value={id}
                        onChange={({ target }) =>
                          setFormState({
                            ...formState,
                            id: target.value,
                          })
                        }
                        disabled={modalState.type == "update"}
                        status={errMessage.id && "error"}
                      />
                      <div className="promotion_header_form_input_err">
                        {errMessage.id}
                      </div>
                    </div>
                  </div>
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_label">Tiêu đề</div>
                    <div className="promotion_header_form_input_wrap">
                      <Input
                        className="promotion_header_form_input"
                        size="small"
                        value={title}
                        onChange={({ target }) =>
                          setFormState({
                            ...formState,
                            title: target.value,
                          })
                        }
                        status={errMessage.title && "error"}
                      />
                      <div className="promotion_header_form_input_err">
                        {errMessage.title}
                      </div>
                    </div>
                  </div>
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_label">
                      Ngày bắt đầu
                    </div>
                    <div className="promotion_header_form_input_wrap">
                      <DatePicker
                        className="promotion_header_form_date"
                        size="small"
                        onChange={handleOnChangeStartDate}
                        disabledDate={disValueStartDate}
                        value={
                          formState.startDate && sqlToAntd(formState.startDate)
                        }
                        disabled={disableStartDate()}
                        status={errMessage.startDate && "error"}
                      />
                      <div className="promotion_header_form_input_err">
                        {errMessage.startDate}
                      </div>
                    </div>
                  </div>
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_label">
                      Ngày kết thúc
                    </div>
                    <div className="promotion_header_form_input_wrap">
                      <DatePicker
                        className="promotion_header_form_date"
                        size="small"
                        onChange={handleOnChangeEndDate}
                        disabledDate={disValueEndDate}
                        value={
                          formState.endDate && sqlToAntd(formState.endDate)
                        }
                        disabled={disableEndDate()}
                        status={errMessage.endDate && "error"}
                      />
                      <div className="promotion_header_form_input_err">
                        {errMessage.endDate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="promotion_header_form_right">
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_label">
                      Đối tượng áp dụng
                    </div>
                    <div className="promotion_header_form_input_wrap">
                      <CustomerGroupSelect
                        className="promotion_header_form_input"
                        size="small"
                        value={customerTypeIds}
                        mode="multiple"
                        onChange={(value) => {
                          console.log(value);
                          setFormState({
                            ...formState,
                            customerTypeIds: value,
                          });
                        }}
                        disabled={modalState.type == "update"}
                        status={errMessage.customerTypeIds && "error"}
                      />

                      <div className="promotion_header_form_input_err">
                        {errMessage.customerTypeIds}
                      </div>
                    </div>
                  </div>
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_label">Mô tả</div>
                    <div className="promotion_header_form_input_wrap">
                      <Input.TextArea
                        showCount
                        maxLength={200}
                        style={{
                          height: 40,
                          marginBottom: 12,
                        }}
                        placeholder="Mô tả về chương trình khuyến mãi"
                        className="promotion_header_form_input"
                        value={description}
                        onChange={({ target }) =>
                          setFormState({
                            ...formState,
                            description: target.value,
                          })
                        }
                        status={errMessage.description && "error"}
                      />

                      <div className="promotion_header_form_input_err">
                        {errMessage.description}
                      </div>
                    </div>
                  </div>
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_label" style={{}}>
                      Trạng thái
                    </div>
                    <div className="promotion_header_form_input_wrap">
                      <Switch
                        onChange={async (is) => {
                          await handleOnChangeState(is, formState.id);
                          setFormState({
                            ...formState,
                            state: is,
                          });
                        }}
                        disabled={disabledChangeHeaderState()}
                        checked={state}
                        status={errMessage.state && "error"}
                      />
                      <div className="promotion_header_form_input_err">
                        {errMessage.state}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {modalState.type == "update" && (
                <PromotionLineTable
                  promotionHeaderId={
                    modalState.rowSelected && modalState.rowSelected.id
                  }
                  headerState={formState.state}
                  isDisabledAddButton={disableAddNewPriceLine(
                    formState.startDate,
                    formState.endDate,
                    formState.state
                  )}
                />
              )}
            </div>
            <Space
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
                marginTop: "12px",
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
                    Lưu & Thêm các dòng khuyến mãi
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

export default PromotionHeaderModal;
