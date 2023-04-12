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
import addressApi from "./../../api/addressApi";
import userApi from "../../api/userApi";
import { useDispatch } from "react-redux";
import { setRefreshCustomer } from "../../store/slices/customerSlice";
import { isEmailValid, isVietnamesePhoneNumberValid } from "../../utils";

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
    homeAddress: "",
  },
};

const CustomerCUModal = ({ modalState, setModalState }) => {
  let hideLoading = null;
  const dispatch = useDispatch();

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

  useEffect(() => {
    let { visible, rowSelected, type } = modalState;
    if (visible && rowSelected && type) {
      let {
        firstName,
        lastName,
        id,
        email,
        phonenumber,
        HomeAddress,
        TypeCustomerId,
      } = rowSelected;

      let _address = {};
      if (HomeAddress) {
        _address.homeAddress = HomeAddress.homeAddress;
        _address.wardId = HomeAddress.Ward.id;
        _address.districtId = HomeAddress.Ward.District.id;
        _address.cityId = HomeAddress.Ward.District.City.id;
      }

      setFormState({
        firstName,
        lastName,
        id,
        email,
        phonenumber,
        address: _address,
        typeCustomerId: TypeCustomerId,
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
    setErrMessage(initErrMessage);
    let formData = {
      firstName,
      lastName,
      phonenumber,
      email,
      typeCustomerId,
      homeAddressId: "",
    };

    if (await checkData()) {
      // create home address
      let res = await addressApi.addHomeAddress({
        homeAddress: address.homeAddress,
        wardId: address.wardId,
      });

      if (res.isSuccess) {
        let homeAddressId = res.home.id;
        formData.homeAddressId = homeAddressId;

        if (type == "create") {
          res = await userApi.addOneCustomer(formData);
          if (res.isSuccess) {
            message.info("Thêm mới khách hàng thành công");
            dispatch(setRefreshCustomer());
            if (isClose) {
              closeModal();
            } else {
              clearModal();
            }
          } else {
            //create error
            message.error("Có lỗi xảy ra, vui lòng thử lại!");
          }
        } else {
          res = await userApi.updateOneCustomer(formData);
          if (res.isSuccess) {
            message.info("Cập nhật thông tin thành công");
            dispatch(setRefreshCustomer());
            closeModal();
          } else {
            // update error
            message.error("Có lỗi xảy ra, vui lòng thử lại!");
          }
        }
      } else {
        message.error("Địa chỉ không hợp lệ, vui lòng thử lại!");
      }
    }

    async function checkData() {
      let isCheck = true;
      let _errMess = {
        address: {},
      };

      if (!firstName) {
        _errMess.firstName = "Không được bỏ trống!";
        isCheck = false;
      }

      if (!lastName) {
        _errMess.lastName = "Không được bỏ trống!";
        isCheck = false;
      }

      if (type == "create") {
        if (!phonenumber) {
          _errMess.phonenumber = "Không được bỏ trống!";
          isCheck = false;
        } else {
          let is = isVietnamesePhoneNumberValid(phonenumber);
          if (!is) {
            _errMess.phonenumber = "Số điện thoại không hợp lệ!";
            isCheck = false;
          }

          let res = await userApi.getOneCustomerByPhone(phonenumber);
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

      if (!typeCustomerId) {
        _errMess.typeCustomerId = "Không được bỏ trống!";
        isCheck = false;
      }

      if (!address.cityId) {
        _errMess.address.cityId = "Không được bỏ trống!";
        isCheck = false;
      }

      if (!address.districtId) {
        _errMess.address.districtId = "Không được bỏ trống!";
        isCheck = false;
      }

      if (!address.wardId) {
        _errMess.address.wardId = "Không được bỏ trống!";
        isCheck = false;
      }

      if (!address.homeAddress) {
        _errMess.address.homeAddress = "Không được bỏ trống!";
        isCheck = false;
      }

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
                      status={errMessage.firstName && "error"}
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
                      status={errMessage.lastName && "error"}
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
                      disabled={modalState.type == "update"}
                      status={errMessage.phonenumber && "error"}
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
                      status={errMessage.email && "error"}
                    />
                    <div className="customer_form_input_err">
                      {errMessage.email}
                    </div>
                  </div>
                </div>
                <div className="customer_form_group">
                  <div className="customer_form_label">Nhóm khách hàng</div>
                  <div className="customer_form_input_wrap">
                    <CustomerGroupSelect
                      style={{ width: 200 }}
                      onChange={(value) => {
                        setFormState({
                          ...formState,
                          typeCustomerId: value,
                        });
                      }}
                      value={typeCustomerId}
                      status={errMessage.typeCustomerId && "error"}
                    />
                    <div className="customer_form_input_err">
                      {errMessage.typeCustomerId}
                    </div>
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
                  errMess={errMessage.address}
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
