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
import { setRefreshCustomerTypes } from "../../store/slices/customerTypeSlice";

const initFormState = {
  id: "",
  name: "",
};
const initErrMessage = {
  id: "",
  name: "",
};

const CustomerGroupCuModal = ({ modalState, setModalState }) => {
  let hideLoading = null;
  const dispatch = useDispatch();

  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);

  let { id, name } = formState;

  useEffect(() => {
    const { visible, type, rowSelected } = modalState;
    if (visible && type && rowSelected) {
      setFormState({
        id: rowSelected.id,
        name: rowSelected.name,
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
      id,
      name,
    };

    if (await checkData()) {
      let res = {};

      if (type == "create") {
        res = await userApi.addOneType(formData);
        if (res.isSuccess) {
          message.info("Thêm mới nhóm khách hàng thành công");
          dispatch(setRefreshCustomerTypes());
          if (isClose) {
            closeModal();
          } else {
            clearModal();
          }
        } else {
          message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      } else {
        res = await userApi.updateOneType(formData);
        if (res.isSuccess) {
          message.info("Cập nhật thành công");
          dispatch(setRefreshCustomerTypes());
          closeModal();
        } else {
          message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      }
    }

    async function checkData() {
      let isCheck = true;
      let _errMess = { ...errMessage };

      if (!id) {
        _errMess.id = "Không được bỏ trống!";
        isCheck = false;
      } else {
        if (type == "create") {
          let res = await userApi.getOneTypeById(id);
          if (res.isSuccess) {
            _errMess.id = "Mã đã tồn tại!";
            isCheck = false;
          }
        }
      }

      if (!name) {
        _errMess.name = "Không được bỏ trống!";
        isCheck = false;
      }

      setErrMessage(_errMess);
      return isCheck;
    }
  }

  return (
    <div className="customer_group_modal">
      <ModalCustomer
        visible={modalState.visible}
        style={{
          width: "380px",
        }}
        closeModal={() => {
          setModalState({ visible: false });
        }}
      >
        <div>
          <div className="title__container">
            <Typography.Title level={4} className="title">
              {modalState.type == "update"
                ? "Cập nhật thông tin nhóm khách hàng"
                : "Thêm mới nhóm khách hàng"}
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="customer_group_form">
              <div className="customer_group_form_group">
                <div className="customer_group_form_label">Mã nhóm </div>
                <div className="customer_group_form_input_wrap">
                  <Input
                    className="customer_group_form_input"
                    size="small"
                    value={id}
                    onChange={({ target }) => {
                      setFormState({
                        ...formState,
                        id: target.value,
                      });
                    }}
                    disabled={modalState.type == "update"}
                    status={errMessage.id && "error"}
                  />
                  <div className="customer_group_form_input_err">
                    {errMessage.id}
                  </div>
                </div>
              </div>
              <div className="customer_group_form_group">
                <div className="customer_group_form_label">Tên nhóm</div>
                <div className="customer_group_form_input_wrap">
                  <Input
                    className="customer_group_form_input"
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
                  <div className="customer_group_form_input_err">
                    {errMessage.name}
                  </div>
                </div>
              </div>
            </div>
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

export default CustomerGroupCuModal;
