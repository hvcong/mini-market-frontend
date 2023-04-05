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
  Tag,
} from "antd";
import ModalCustomer from "../ModalCustomer";
import { useDispatch, useSelector } from "react-redux";

import BillLineTable from "./BillLineTable";
import CreateBill from "./createBill/CreateBill";
import billApi from "./../../api/billApi";
import dayjs from "dayjs";
import ListPromotion from "./ListPromotion";
import ReceiveButton from "./ReceiveButton";
import { setOpen } from "../../store/slices/modalSlice";
import { convertToVND } from "../../utils";
import { setRefreshBills } from "../../store/slices/billSlice";
const dateFormat = "YYYY-MM-DD";

const initFormState = {
  id: "",
  orderDate: "",
  cost: "",
  CustomerId: "",
  EmployeeId: "",
  BillDetails: "",
  PromotionResults: [],
};

const BillCUModal = () => {
  let hideLoading = null;
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal.modals.BillCUModal);
  const [formState, setFormState] = useState(initFormState);
  const [receiveOpenId, setReceiveOpenId] = useState("");
  const [listKM, setListKM] = useState([]);
  const [MPused, setMPused] = useState(null);

  let type = formState.type;

  useEffect(() => {
    const { type, idSelected, visible } = modalState;
    if (idSelected && visible) {
      loadOneBill(idSelected);
    }
    return () => {};
  }, [modalState]);

  async function loadOneBill(billId) {
    hideLoading = message.loading("Đang tải dữ liệu hóa đơn...", 0);
    let res = await billApi.getOneBillById(billId);
    hideLoading();
    if (res.isSuccess) {
      setFormState({
        ...res.bill,
      });
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

  function setModalState(state) {
    dispatch(
      setOpen({
        name: "BillCUModal",
        modalState: state,
      })
    );
  }

  function clearModal() {
    setFormState(initFormState);
  }

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, [modalState]);

  useEffect(() => {
    if (formState.PromotionResults) {
      let promotionResults = formState.PromotionResults.map((result) => {
        if (result.ProductPromotionId) {
          let {
            id,
            isSuccess,
            note,
            BillId,
            ProductPromotionId,
            ProductPromotion,
          } = result;

          return {
            id,
            isSuccess,
            note,
            BillId,
            ProductPromotionId,
            ProductPromotion,
            type: "PP",
          };
        }
        if (result.MoneyPromotion) {
          let {
            id,
            isSuccess,
            note,
            BillId,
            MoneyPromotionId,
            MoneyPromotion,
          } = result;
          setMPused(result.MoneyPromotion);

          return {
            id,
            isSuccess,
            note,
            BillId,
            MoneyPromotionId,
            MoneyPromotion,
            type: "MP",
          };
        }
        if (result.DiscountRateProduct) {
          let {
            id,
            isSuccess,
            note,
            BillId,
            DiscountRateProductId,
            DiscountRateProduct,
          } = result;

          return {
            id,
            isSuccess,
            note,
            BillId,
            DiscountRateProductId,
            DiscountRateProduct,
            type: "DRP",
          };
        }
        if (result.Voucher) {
          let { id, isSuccess, note, BillId, VoucherId, Voucher } = result;

          return {
            id,
            isSuccess,
            note,
            BillId,
            VoucherId,
            Voucher,
            type: "V",
          };
        }
      }).filter((item) => item.id);

      setListKM(promotionResults);
    }

    return () => {};
  }, [formState]);

  async function orderToBill(billId) {
    hideLoading = message.loading("Đang xử lí...");
    let res = await billApi.updateType(billId, "success");
    if (res.isSuccess) {
      message.info("Thao tác thành công", 3);
      closeModal();

      dispatch(setRefreshBills());
    } else {
      message.info("Có lỗi xảy ra, vui lòng thử lại!", 3);
    }
    hideLoading();
  }

  async function cancelOrder(billId) {
    hideLoading = message.loading("Đang xử lí...");
    let res = await billApi.updateType(billId, "cancel");
    if (res.isSuccess) {
      message.info("Thao tác thành công", 3);

      closeModal();
      dispatch(setRefreshBills());
    } else {
      message.info("Có lỗi xảy ra, vui lòng thử lại!", 3);
    }
    hideLoading();
  }

  return (
    <div className="bill_modal">
      <ModalCustomer
        visible={modalState.visible}
        style={{
          width: "90%",
        }}
      >
        <div>
          <div className="title__container">
            <Typography.Title level={4} className="title">
              {type == "retrieve" && "Thông tin hóa đơn đã trả"}
              {type == "success" && "Thông tin chi tiết hóa đơn"}
              {type == "pending" || (type == "cancel" && "Thông tin đơn hàng")}
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="bill_form">
              <div className="bill_form_top">
                <div className="bill_form_left">
                  <div className="bill_form_group">
                    <div className="bill_form_label">
                      {type == "order-view" ? "Mã đơn đặt hàng" : "Mã hóa đơn"}
                    </div>
                    <div className="bill_form_input_wrap">
                      <Input
                        className="bill_form_input"
                        size="small"
                        disabled
                        value={formState.id}
                      />
                      <div className="bill_form_input_err"></div>
                    </div>
                  </div>
                  <div className="bill_form_group">
                    <div className="bill_form_label">
                      {type == "cancel" || type == "pending"
                        ? "Thời gian đặt"
                        : "Thời gian tạo"}
                    </div>
                    <div className="bill_form_input_wrap">
                      <DatePicker
                        className="bill_form_input"
                        size="small"
                        disabled
                        value={
                          formState.orderDate &&
                          dayjs(formState.orderDate, dateFormat)
                        }
                      />
                      <div className="bill_form_input_err"></div>
                    </div>
                  </div>

                  {type != "order-view" && (
                    <div className="bill_form_group">
                      <div className="bill_form_label">Mã nhân viên</div>
                      <div className="bill_form_input_wrap">
                        <Typography.Link>
                          {formState.EmployeeId}
                        </Typography.Link>
                        <div className="bill_form_input_err"></div>
                      </div>
                    </div>
                  )}
                  <div className="bill_form_group">
                    <div className="bill_form_label">Mã khách hàng</div>
                    <div className="bill_form_input_wrap">
                      <Typography.Link>{formState.CustomerId}</Typography.Link>

                      <div className="bill_form_input_err"></div>
                    </div>
                  </div>

                  <div className="bill_form_group">
                    <div className="bill_form_label">
                      {type == "order-view"
                        ? "Tổng giá trị đơn hàng"
                        : "Tổng giá trị hóa đơn"}
                    </div>
                    <div className="bill_form_input_wrap">
                      <Typography.Title
                        level={5}
                        style={{ padding: 0, margin: 0 }}
                      >
                        {convertToVND(Number(formState.cost)) + "  đồng"}
                      </Typography.Title>

                      <div className="bill_form_input_err"></div>
                    </div>
                  </div>

                  <div className="bill_form_group">
                    <div className="bill_form_label">Trạng thái</div>
                    <div className="bill_form_input_wrap">
                      <div className="bill_form_input_state_success">
                        {type == "success" && (
                          <Tag style={{ fontSize: "13px" }} color="green">
                            Thành công
                          </Tag>
                        )}
                        {type == "retrieve" && (
                          <Tag style={{ fontSize: "13px" }} color="volcano">
                            Đã trả hàng
                          </Tag>
                        )}
                        {type == "pending" && (
                          <Tag style={{ fontSize: "13px" }} color="green">
                            Đang chờ xử lí
                          </Tag>
                        )}
                        {type == "cancel" && (
                          <Tag style={{ fontSize: "13px" }} color="volcano">
                            Đã hủy
                          </Tag>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bill_form_right">
                  <div className="bill_form_promotion">
                    <div className="bill_form_promotion_title">
                      <Typography.Title level={5}>
                        Các khuyến mãi đã áp dụng
                      </Typography.Title>
                    </div>
                    <div className="bill_form_promotion_list">
                      {formState.PromotionResults && (
                        <ListPromotion listKM={listKM} />
                      )}
                    </div>
                  </div>
                  {type == "retrieve" && (
                    <div className="bill_form_note">
                      <div className="bill_form_note_label">
                        Ghi chú trả hàng
                      </div>
                      <Input.TextArea
                        disabled
                        value={
                          formState.RetrieveBill && formState.RetrieveBill.note
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="bill_form_bottom">
                <BillLineTable
                  BillDetails={formState.BillDetails}
                  listKM={listKM}
                />
              </div>
            </div>
            <Space
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
                marginTop: "12px",
              }}
            >
              {type == "success" && (
                <>
                  <ReceiveButton
                    open={receiveOpenId}
                    setOpen={(value) => {
                      setReceiveOpenId(value);
                    }}
                    billId={modalState.visible && modalState.idSelected}
                    handleReceiveOke={() => {
                      setModalState({
                        visible: false,
                      });
                    }}
                  />

                  <Button type="primary">Xem hóa đơn in</Button>
                </>
              )}

              {type == "pending" && (
                <>
                  <Button
                    type="primary"
                    onClick={() => {
                      orderToBill(formState.id);
                    }}
                  >
                    Thanh toán
                  </Button>
                  <Button
                    onClick={() => {
                      cancelOrder(formState.id);
                    }}
                    danger
                  >
                    Hủy đơn hàng
                  </Button>
                </>
              )}

              <Button type="primary" danger onClick={closeModal}>
                Đóng
              </Button>
            </Space>
          </div>
        </div>
      </ModalCustomer>
    </div>
  );
};

export default BillCUModal;
