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
import userApi from "./../../api/userApi";
import { useDispatch } from "react-redux";
import { setRefreshEmployees } from "../../store/slices/employeeSlice";
import { isEmailValid, isVietnamesePhoneNumberValid } from "../../utils";

const initFormState = {
  id: "",
  name: "",
  phonenumber: "",
  email: "",
};
const initErrMessage = {
  name: "",
  phonenumber: "",
  email: "",
};

const EmployeeCUModal = ({ modalState, setModalState }) => {
  let hideLoading = null;
  const dispatch = useDispatch();

  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);

  const { id, name, phonenumber, email } = formState;

  useEffect(() => {
    let { type, rowSelected, visible } = modalState;

    if (type == "update" && visible && rowSelected) {
      setFormState({
        ...rowSelected,
      });
    }

    return () => {};
  }, [modalState]);

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

  async function onSubmit(type, isClose) {
    let formData = {
      name,
      phonenumber,
      email,
    };

    if (await checkData()) {
      // validate oke
      let res = {};
      if (type == "create") {
        res = await userApi.addEmployee(formData);
        if (res.isSuccess) {
          dispatch(setRefreshEmployees());
          message.info("Thêm mới nhân viên thành công");
          if (isClose) {
            closeModal();
          } else {
            clearModal();
          }
        } else {
          message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      } else {
        res = await userApi.updateEmployee(formData);
        if (res.isSuccess) {
          message.info("Cập nhật thông tin nhân viên thành công");
          closeModal();
        } else {
          message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      }
    }

    async function checkData() {
      let isCheck = true;
      let _errMess = { ...errMessage };

      if (!name) {
        _errMess.name = "Không được bỏ trống!";
        isCheck = false;
      }

      if (!phonenumber) {
        _errMess.phonenumber = "Không được bỏ trống!";
        isCheck = false;
      } else {
        let is = isVietnamesePhoneNumberValid(phonenumber);
        if (!is) {
          _errMess.phonenumber = "Số điện thoại không hợp lệ!";
          isCheck = false;
        }

        if (type == "create") {
          let res = await userApi.getOneEmployeeByPhone(phonenumber);
          if (res.isSuccess) {
            _errMess.phonenumber = "Số điện thoại đã được sử dụng!";
            isCheck = false;
          }
        }
      }

      if (email) {
        let is = isEmailValid(email);
        if (!is) {
          _errMess.email = "Email không hợp lệ!";
          isCheck = false;
        }
      }

      setErrMessage(_errMess);

      return isCheck;
    }
  }

  return (
    <div className="employee_modal">
      <ModalCustomer
        visible={modalState.visible}
        style={{
          width: "440px",
        }}
      >
        <div>
          <div className="title__container">
            <Typography.Title level={4} className="title">
              {modalState.type == "update"
                ? "Cập nhật thông tin nhân viên"
                : "Thêm mới nhân viên"}
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="employee_form">
              {modalState.type == "update" && (
                <div className="employee_form_group">
                  <div className="employee_form_label">Mã nhân viên</div>
                  <div className="employee_form_input_wrap">
                    <Input
                      className="employee_form_input"
                      size="small"
                      value={id}
                      disabled={modalState.type == "update"}
                    />
                  </div>
                </div>
              )}
              <div className="employee_form_group">
                <div className="employee_form_label">Tên nhân viên</div>
                <div className="employee_form_input_wrap">
                  <Input
                    className="employee_form_input"
                    size="small"
                    value={name}
                    onChange={({ target }) => {
                      setFormState({
                        ...formState,
                        name: target.value,
                      });
                    }}
                    status={errMessage.name && "error"}
                  />
                  <div className="employee_form_input_err">
                    {errMessage.name}
                  </div>
                </div>
              </div>
              <div className="employee_form_group">
                <div className="employee_form_label">Số điện thoại</div>
                <div className="employee_form_input_wrap">
                  <Input
                    className="employee_form_input"
                    size="small"
                    value={phonenumber}
                    onChange={({ target }) => {
                      setFormState({
                        ...formState,
                        phonenumber: target.value,
                      });
                    }}
                    disabled={modalState.type == "update"}
                    status={errMessage.phonenumber && "error"}
                  />
                  <div className="employee_form_input_err">
                    {errMessage.phonenumber}
                  </div>
                </div>
              </div>
              {/* <div className="employee_form_group">
                <div className="employee_form_label">Email</div>
                <div className="employee_form_input_wrap">
                  <Input
                    className="employee_form_input"
                    size="small"
                    value={email}
                    onChange={({ target }) => {
                      setFormState({
                        ...formState,
                        email: target.value,
                      });
                    }}
                    status={errMessage.email && "error"}
                  />
                  <div className="employee_form_input_err">
                    {errMessage.email}
                  </div>
                </div>
              </div> */}
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

export default EmployeeCUModal;
