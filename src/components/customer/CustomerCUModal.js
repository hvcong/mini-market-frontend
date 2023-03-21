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
import CustomerGroupSelect from "../customerGroup/CustomerGroupSelect";
import AddressSelectAll from "../AddressSelectAll";

const initFormState = {
  id: "",
  firstName: "",
  lastName: "",
  phonenumber: "",
  address: {
    cityId: "",
    districtId: "",
    wardId: "",
    home: "",
  },
  typeCustomerId: "",
  email: "",
};
const initErrMessage = {
  id: "",
  firstName: "",
  lastName: "",
  phonenumber: "",
  typeCustomerId: "",
  email: "",
  address: {
    cityId: "",
    districtId: "",
    wardId: "",
    home: "",
  },
};

const CustomerCUModal = ({ modalState, setModalState }) => {
  let hideLoading = null;

  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);

  const {
    firstName,
    lastName,
    phonenumber,
    address,
    typeCustomerId,
    email,
    id,
  } = formState;

  function closeModal() {
    setModalState({
      visible: false,
    });
  }

  function clearModal() {
    setErrMessage(initErrMessage);
    setFormState(initFormState);
  }

  async function onSubmit(type, isClose) {
    if (await checkData()) {
    }

    async function checkData() {
      let isCheck = true;
      let _errMess = {};

      setErrMessage(_errMess);
      return isCheck;
    }
  }

  return (
    <div className="customer_modal">
      <ModalCustomer
        visible={modalState.visible}
        style={{
          width: "760px",
        }}
      >
        <div>
          <div className="title__container">
            <Typography.Title level={4} className="title">
              {modalState.type == "update"
                ? "Cập nhật thông tin khách hàng"
                : "Thêm mới khách hàng"}
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="customer_form">
              <div className="customer_form_left">
                <div className="customer_form_group">
                  <div className="customer_form_label">Mã khách hàng</div>
                  <div className="customer_form_input_wrap">
                    <Input
                      className="customer_form_input"
                      size="small"
                      value={id}
                      disabled
                    />
                    <div className="customer_form_input_err"></div>
                  </div>
                </div>
                <div className="customer_form_group">
                  <div className="customer_form_label">Họ</div>
                  <div className="customer_form_input_wrap">
                    <Input
                      className="customer_form_input"
                      size="small"
                      value={firstName}
                      onChange={({ target }) => {
                        setFormState({
                          ...formState,
                          firstName: target.value,
                        });
                      }}
                      state={errMessage.firstName && "error"}
                    />
                    <div className="customer_form_input_err">
                      {errMessage.firstName}
                    </div>
                  </div>
                </div>
                <div className="customer_form_group">
                  <div className="customer_form_label">Tên</div>
                  <div className="customer_form_input_wrap">
                    <Input
                      className="customer_form_input"
                      size="small"
                      value={lastName}
                      onChange={({ target }) => {
                        setFormState({
                          ...formState,
                          lastName: target.value,
                        });
                      }}
                      state={errMessage.lastName && "error"}
                    />
                    <div className="customer_form_input_err">
                      {errMessage.lastName}
                    </div>
                  </div>
                </div>
                <div className="customer_form_group">
                  <div className="customer_form_label">Số điện thoại</div>
                  <div className="customer_form_input_wrap">
                    <Input
                      className="customer_form_input"
                      size="small"
                      value={phonenumber}
                      onChange={({ target }) => {
                        setFormState({
                          ...formState,
                          phonenumber: target.value,
                        });
                      }}
                      state={errMessage.phonenumber && "error"}
                    />
                    <div className="customer_form_input_err">
                      {errMessage.phonenumber}
                    </div>
                  </div>
                </div>
                <div className="customer_form_group">
                  <div className="customer_form_label">Email</div>
                  <div className="customer_form_input_wrap">
                    <Input
                      className="customer_form_input"
                      size="small"
                      value={email}
                      onChange={({ target }) => {
                        setFormState({
                          ...formState,
                          email: target.value,
                        });
                      }}
                      state={errMessage.email && "error"}
                    />
                    <div className="customer_form_input_err">
                      {errMessage.email}
                    </div>
                  </div>
                </div>
                <div className="customer_form_group">
                  <div className="customer_form_label">Nhóm khách hàng</div>
                  <div className="customer_form_input_wrap">
                    <CustomerGroupSelect style={{ width: 200 }} />
                  </div>
                </div>
              </div>
              <div className="customer_form_right">
                <AddressSelectAll
                  address={address}
                  setAddress={(address) => {
                    setFormState({
                      ...formState,
                      address,
                    });
                  }}
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

export default CustomerCUModal;
