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

import BillLineTable from "./BillLineTable";
import CreateBill from "./createBill/CreateBill";
import billApi from "./../../api/billApi";
import dayjs from "dayjs";
import ListPromotion from "./ListPromotion";
import ReceiveButton from "./ReceiveButton";
const dateFormat = "YYYY-MM-DD";

const initFormState = {
  id: "",
  orderDate: "",
  cost: "",
  CustomerId: "",
  EmployeeId: "",
  BillDetails: "",
  PromotionResult: "",
};
const initErrMessage = {};

const BillCUModal = ({ modalState, setModalState }) => {
  let hideLoading = null;
  const dispatch = useDispatch();

  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);
  const [receiveOpenId, setReceiveOpenId] = useState("");

  useEffect(() => {
    const { type, rowSelected, visible } = modalState;
    if (rowSelected && visible) {
      let billId = "";
      if (type == "update") {
        billId = rowSelected.id;
      }
      if (type == "view-receive") {
        billId = rowSelected.BillId;
      }

      loadOneBill(billId);
    }
    return () => {};
  }, [modalState]);

  async function loadOneBill(billId) {
    hideLoading = message.loading("Đang tải dữ liệu hóa đơn...", 0);
    let res = await billApi.getOneBillById(billId);
    if (res.isSuccess) {
      setFormState({
        ...res.bill,
      });
    }
    hideLoading();
  }

  async function onSubmit(type, isClose) {
    setErrMessage({});
    let formData = {};

    if (await checkData()) {
      let res = {};
    }

    async function checkData() {
      let isCheck = true;
      let _errMess = {};

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

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, [modalState]);

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
              Thông tin chi tiết hóa đơn
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="bill_form">
              <div className="bill_form_top">
                <div className="bill_form_left">
                  <div className="bill_form_group">
                    <div className="bill_form_label">Mã hóa đơn</div>
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
                    <div className="bill_form_label">Thời gian tạo</div>
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
                  <div className="bill_form_group">
                    <div className="bill_form_label">Mã nhân viên</div>
                    <div className="bill_form_input_wrap">
                      <Typography.Link>{formState.EmployeeId}</Typography.Link>
                      <div className="bill_form_input_err"></div>
                    </div>
                  </div>
                  <div className="bill_form_group">
                    <div className="bill_form_label">Mã khách hàng</div>
                    <div className="bill_form_input_wrap">
                      <Typography.Link>{formState.CustomerId}</Typography.Link>

                      <div className="bill_form_input_err"></div>
                    </div>
                  </div>
                  <div className="bill_form_group">
                    <div className="bill_form_label">Tổng giá trị hóa đơn</div>
                    <div className="bill_form_input_wrap">
                      <Input
                        className="bill_form_input"
                        size="small"
                        disabled
                        value={formState.cost + " đồng"}
                      />
                      <div className="bill_form_input_err"></div>
                    </div>
                  </div>
                </div>
                <div className="bill_form_promotion">
                  <div className="bill_form_promotion_title">
                    <Typography.Title level={5}>
                      Các khuyến mãi đã áp dụng
                    </Typography.Title>
                  </div>
                  <div className="bill_form_promotion_list">
                    <div className="bill_form_promotion_item">
                      <div className="bill_form_promotion_item_id">
                        <Typography.Title level={5}>
                          Mã khuyến mãi
                        </Typography.Title>
                      </div>
                      <div className="bill_form_promotion_item_type">
                        <Typography.Title level={5}>
                          Loại khuyến mãi
                        </Typography.Title>
                      </div>
                      <div className="bill_form_promotion_item_status">
                        <Typography.Title level={5}>
                          Trạng thái
                        </Typography.Title>
                      </div>
                    </div>
                    {formState.PromotionResult && (
                      <ListPromotion
                        promotionResult={formState.PromotionResult}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="bill_form_bottom">
                <BillLineTable BillDetails={formState.BillDetails} />
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
              {modalState.type != "view-receive" && (
                <>
                  <ReceiveButton
                    open={receiveOpenId}
                    setOpen={(value) => {
                      setReceiveOpenId(value);
                    }}
                    billId={
                      modalState.visible &&
                      modalState.rowSelected &&
                      modalState.rowSelected.id
                    }
                    handleReceiveOke={() => {
                      setModalState({
                        visible: false,
                      });
                    }}
                  />

                  <Button
                    type="primary"
                    onClick={() => {
                      onSubmit("update", true);
                    }}
                  >
                    Xem hóa đơn in
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
