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

const initFormState = {
  id: "",
  startDate: "",
  endDate: "",
  title: "",
  description: "",
  budget: 0,
  availableBudget: 0,
  state: "",
  image: "",
  customerTypeIds: [],
};
const initErrMessage = {
  id: "",
  time: "",
  title: "",
  description: "",
  budget: "",
  availableBudget: "",
  state: "",
  image: "",
  customerTypeIds: "",
};

const PromotionHeaderModal = ({ modalState, setModalState }) => {
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
    budget,
    availableBudget,
    state,
    image,
    customerTypeIds,
  } = formState;

  useEffect(() => {
    const { type, rowSelected, visible } = modalState;

    if (type == "update" && rowSelected && visible) {
      setFormState({
        ...rowSelected,
      });
    }

    return () => {};
  }, [modalState]);

  async function onSubmit(type, isClose) {
    setErrMessage({});
    let formData = {
      id,
      startDate,
      endDate,
      title,
      description,
      budget,
      state,
      image,
    };

    if (await checkData()) {
      let res = {};

      if (modalState.type == "create") {
        hideLoading = message.loading("Đang tạo mới...", 0);
        res = await promotionApi.addOneHeader(formData);
        if (res.isSuccess) {
          hideLoading();
          message.info("Thêm mới thành công");
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
          message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      } else {
        // update
        hideLoading = message.loading("Đang cập nhật...", 0);
        res = await promotionApi.updateOneHeader(id, {
          title,
          state,
          description,
          startDate,
          endDate,
        });

        if (res.isSuccess) {
          hideLoading();
          message.info("Cập nhật thành công");
          dispatch(setRefreshPromotionHeaders());
          dispatch(setRefreshPromotionLines());
        }
      }
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

      if (!budget || budget == 0) {
        _errMess.budget = "Ngân sách phải lớn hơn 0!";
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
                <div className="promotion_header_form_first">
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_input_wrap">
                      <ImageUpload />
                      <div className="promotion_header_form_input_err"></div>
                    </div>
                  </div>
                </div>
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
                    <div className="promotion_header_form_label">Thời gian</div>
                    <div className="promotion_header_form_input_wrap">
                      <DatePickerCustom
                        className="promotion_header_form_date"
                        size="small"
                        onChangeDate={onChangeDate}
                        value={[startDate, endDate]}
                        status={errMessage.time && "error"}
                      />
                      <div className="promotion_header_form_input_err">
                        {errMessage.time}
                      </div>
                    </div>
                  </div>

                  {modalState?.type == "update" ? (
                    <div className="promotion_header_form_group">
                      <div className="promotion_header_form_label">
                        Ngân sách còn lại
                      </div>
                      <div className="promotion_header_form_input_wrap">
                        <InputNumber
                          className="promotion_header_form_input_number"
                          size="small"
                          value={availableBudget}
                          disabled
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="promotion_header_form_group">
                      <div className="promotion_header_form_label">
                        Tổng ngân sách
                      </div>
                      <div className="promotion_header_form_input_wrap">
                        <InputNumber
                          className="promotion_header_form_input_number"
                          size="small"
                          value={budget}
                          onChange={(value) =>
                            setFormState({
                              ...formState,
                              budget: value,
                            })
                          }
                          status={errMessage.budget && "error"}
                        />
                        <div className="promotion_header_form_input_err">
                          {errMessage.budget}
                        </div>
                      </div>
                    </div>
                  )}
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
                        onChange={(value) =>
                          setFormState({
                            ...formState,
                            state: value,
                          })
                        }
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
                  promotionHeaderId={modalState.rowSelected.id}
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
