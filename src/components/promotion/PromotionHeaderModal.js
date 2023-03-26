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
import { compareDMY } from "../../utils";
import dayjs from "dayjs";

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
  startDate: "",
  endDate: "",
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
      getOneHeaderById(rowSelected.id);
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
      budget,
      state,
      availableBudget: budget,
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

  async function handleOnChangeState(is) {
    if (modalState.type == "create") {
      // to active
      if (is) {
        if (!formState.startDate || !formState.endDate) {
          message.error("Vui lòng chọn ngày bắt đầu và kết thúc trước!", 3);
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
          message.error("Ngày bắt đầu phải bé hơn hoặc bằng ngày hiện tại!", 3);
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
          message.error("Ngày bắt đầu phải bé hơn hoặc bằng ngày hiện tại!", 3);
        }

        if (compareDMY(new Date(end), new Date()) < 1) {
          isCheck = false;
          message.error("Ngày kết thúc phải lớn hơn ngày hiện tại!", 3);
        }

        // kiểm tra trùng
        // let res = await priceHeaderApi.getAllOnActive();

        // let isExist = false;
        // if (res.isSuccess) {
        //   let headers = res.headers || [];
        //   // loop through each header
        //   for (const header of headers) {
        //     // loop through each line in a header
        //     let priceLines = header.Prices || [];

        //     for (const line of priceLines) {
        //       console.log(priceLines);
        //       for (const _lineThisHeader of formState.Prices || []) {
        //         if (
        //           _lineThisHeader.ProductUnitTypeId == line.ProductUnitTypeId
        //         ) {
        //           isExist = true;
        //           isCheck = false;
        //           message.error(
        //             `Sản phẩm "${line.ProductUnitType.Product.name} với đơn vị ${line.ProductUnitType.UnitType.name}" đang được bán ở bảng ${header.title} `
        //           );
        //         }
        //       }
        //     }
        //   }
        // }

        if (isCheck) {
          // to active header
          let res = await promotionApi.updateOneHeader(formState.id, {
            state: true,
          });

          if (res.isSuccess) {
            setFormState({
              ...formState,
              state: true,
            });
            message.info("Chương trình khuyến mãi đã bắt đầu sử dụng.", 3);
            dispatch(setRefreshPromotionHeaders());
          }
        }
      } else {
        let res = await promotionApi.updateOneHeader(formState.id, {
          state: false,
        });

        if (res.isSuccess) {
          setFormState({
            ...formState,
            state: false,
          });
          message.info("Đã tạm dừng khuyến mãi ", 3);
          dispatch(setRefreshPromotionHeaders());
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
        message.error("Ngày kết thúc phải lớn hơn ngày bắt đầu!", 3);
        return;
      }

      if (compareDMY(new Date(string), now) <= 0) {
        message.error("Ngày kết thúc phải lớn hơn ngày hiện tại!", 3);
        return;
      }

      console.log("herer");
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
                    <div className="promotion_header_form_label">
                      Ngày bắt đầu
                    </div>
                    <div className="promotion_header_form_input_wrap">
                      <DatePicker
                        className="promotion_header_form_date"
                        size="small"
                        onChange={handleOnChangeStartDate}
                        disabledDate={(current) => {
                          let now = new Date();
                          if (modalState.type == "update") {
                            let end = new Date(formState.endDate);
                            end.setDate(end.getDate() - 1);
                            return (
                              (current &&
                                current <
                                  dayjs(now.setDate(now.getDate() - 1))) ||
                              (current && current >= dayjs(end))
                            );
                          }
                          return (
                            current &&
                            current < dayjs(now.setDate(now.getDate() - 1))
                          );
                        }}
                        value={
                          formState.startDate &&
                          dayjs(formState.startDate, "YYYY-MM-DD")
                        }
                        disabled={disabledStartDate()}
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
                        disabledDate={(current) => {
                          let isDisable = false;
                          if (modalState.type == "create") {
                            let st = new Date(formState.startDate);
                            isDisable =
                              current <= dayjs(st.setDate(st.getDate()));
                          } else {
                            let st = new Date(formState.startDate);
                            isDisable =
                              current <= dayjs(st.setDate(st.getDate())) ||
                              current <= dayjs(new Date());
                          }
                          return isDisable;
                        }}
                        value={
                          formState.endDate &&
                          dayjs(formState.endDate, "YYYY-MM-DD")
                        }
                        disabled={disableEndDate()}
                        status={errMessage.endDate && "error"}
                      />
                      <div className="promotion_header_form_input_err">
                        {errMessage.endDate}
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
                        onChange={handleOnChangeState}
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
