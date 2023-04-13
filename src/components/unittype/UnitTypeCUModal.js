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
import unitTypeApi from "../../api/unitTypeApi";
import { useDispatch, useSelector } from "react-redux";
import { setRefreshUnitType } from "../../store/slices/unitTypeSlice";
import { setOpen } from "../../store/slices/modalSlice";

const initFormState = {
  id: "",
  name: "",
  convertionQuantity: 1,
};
const initErrMessage = {
  id: "",
  name: "",
  convertionQuantity: "",
};

const UnitTypeCUModal = () => {
  let hideLoading = null;
  const dispatch = useDispatch();
  const modalState = useSelector(
    (state) => state.modal.modals["UnitTypeCUModal"]
  );

  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);
  const idInputRef = useRef();

  let { id, name, convertionQuantity } = formState;

  useEffect(() => {
    if (idInputRef.current) {
      idInputRef.current.focus();
    }
    if (
      modalState.type == "update" &&
      modalState.visible == true &&
      modalState.idSelected
    ) {
      getOneUTbyId(modalState.idSelected);
    }

    return () => {};
  }, [modalState]);

  async function getOneUTbyId(id) {
    let res = await unitTypeApi.getOneById(id);
    if (res.isSuccess) {
      setFormState({
        id: res.unitType.id,
        name: res.unitType.name,
        convertionQuantity: res.unitType.convertionQuantity,
      });
    }
  }

  function closeModal() {
    dispatch(
      setOpen({
        name: "UnitTypeCUModal",
        modalState: {
          visible: false,
        },
      })
    );
    clearModal();
  }

  function clearModal() {
    setErrMessage(initErrMessage);
    setFormState(initFormState);
    if (idInputRef.current) {
      idInputRef.current.focus();
    }
  }

  async function onSubmit(type, isClose) {
    let formData = {
      id,
      name,
      convertionQuantity: convertionQuantity,
    };

    if (await checkData()) {
      let res = {};
      if (type == "create") {
        // create
        res = await unitTypeApi.addOne(formData);
        if (res.isSuccess) {
          dispatch(setRefreshUnitType());
          message.info("Tạo mới thành công");
          if (isClose) {
            closeModal();
          } else {
            clearModal();
          }
        } else {
          message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      } else {
        // update
        res = await unitTypeApi.updateOne(id, {
          name,
        });

        if (res.isSuccess) {
          dispatch(setRefreshUnitType());
          message.info("Cập nhật thành công");
          closeModal();
        } else {
          message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      }
    }

    async function checkData() {
      let isCheck = true;
      let _errMess = {};

      if (type == "create") {
        if (!id) {
          _errMess.id = "Không được bỏ trống!";
          isCheck = false;
        } else {
          let res = await unitTypeApi.getOneById(id);
          if (res.isSuccess) {
            _errMess.id = "Mã này đã tồn tại!";
            isCheck = false;
          }
        }

        if (!name) {
          _errMess.name = "Không được bỏ trống!";
          isCheck = false;
        }

        if (convertionQuantity <= 0) {
          _errMess.convertionQuantity = "Phải lớn hơn 0";
          isCheck = false;
        }
      } else {
      }

      setErrMessage(_errMess);
      return isCheck;
    }
  }

  return (
    <div className="unitType_modal">
      <ModalCustomer
        visible={modalState.visible}
        style={{
          width: "380px",
        }}
        closeModal={() => {
          dispatch(
            setOpen({
              name: "UnitTypeCUModal",
              modalState: {
                visible: false,
              },
            })
          );
        }}
      >
        <div>
          <div className="title__container">
            <Typography.Title level={4} className="title">
              {modalState.type == "update"
                ? "Cập nhật thông tin đơn vị tính"
                : "Thêm mới đơn vị tính"}
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="unitType_form">
              <div className="unitType_form_group">
                <div className="unitType_form_label">Mã đơn vị</div>
                <div className="unitType_form_input_wrap">
                  <Input
                    ref={idInputRef}
                    className="unitType_form_input"
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
                  <div className="unitType_form_input_err">{errMessage.id}</div>
                </div>
              </div>
              <div className="unitType_form_group">
                <div className="unitType_form_label">Tên đơn vị</div>
                <div className="unitType_form_input_wrap">
                  <Input
                    className="unitType_form_input"
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
                  <div className="unitType_form_input_err">
                    {errMessage.name}
                  </div>
                </div>
              </div>
              <div className="unitType_form_group">
                <div className="unitType_form_label">Số lượng quy đổi</div>
                <div className="unitType_form_input_wrap">
                  <InputNumber
                    className="unitType_form_input"
                    size="small"
                    value={convertionQuantity}
                    onChange={(value) => {
                      if (value && value > 0) {
                        setFormState({
                          ...formState,
                          convertionQuantity: value,
                        });
                      }
                    }}
                    disabled={modalState.type == "update"}
                    status={errMessage.convertionQuantity && "error"}
                  />
                  <div className="unitType_form_input_err">
                    {errMessage.convertionQuantity}
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

export default UnitTypeCUModal;
