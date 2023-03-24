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

const initFormState = {};
const initErrMessage = {};

const BillCUModal = ({ modalState, setModalState }) => {
  let hideLoading = null;
  const dispatch = useDispatch();

  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);

  useEffect(() => {
    const { type, rowSelected, visible } = modalState;

    if (type == "update" && rowSelected && visible) {
    }

    return () => {};
  }, [modalState]);

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
              {modalState.type == "update" ? "Thông tin chi tiết hóa đơn" : ""}
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="promotion_header_form">
              <div className="promotion_header_form_top">
                <div className="promotion_header_form_left">
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_label">
                      Mã hóa đơn
                    </div>
                    <div className="promotion_header_form_input_wrap">
                      <Input
                        className="promotion_header_form_input"
                        size="small"
                      />
                      <div className="promotion_header_form_input_err"></div>
                    </div>
                  </div>
                </div>
                <div className="promotion_header_form_center">
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_label">
                      Mã hóa đơn
                    </div>
                    <div className="promotion_header_form_input_wrap">
                      <Input
                        className="promotion_header_form_input"
                        size="small"
                      />
                      <div className="promotion_header_form_input_err"></div>
                    </div>
                  </div>
                </div>

                <div className="promotion_header_form_end">
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_label">
                      Mã hóa đơn
                    </div>
                    <div className="promotion_header_form_input_wrap">
                      <Input
                        className="promotion_header_form_input"
                        size="small"
                      />
                      <div className="promotion_header_form_input_err"></div>
                    </div>
                  </div>
                </div>
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

export default BillCUModal;
