import React, { useRef, useState } from "react";
import UploadImageProduct from "../admin/UploadImageProduct";
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
  Alert,
} from "antd";
import ModalCustomer from "../ModalCustomer";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import SelectCategory from "../product/SelectCategory";
import SelectSubCategory from "../product/SelectSubCategory";
import cateApi from "../../api/cateApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setRefreshCate } from "../../store/slices/cateSlice";
import { setOpen } from "../../store/slices/modalSlice";
const { Text } = Typography;

let initCategoryState = {
  id: "",
  name: "",
  state: true,
  image: "",
};

let initListSub = [
  // {
  //   id: "",
  //   name: "",
  //   state: true,
  // },
];

let initErrMessage = {
  image: "",
  categoryId: "",
  categoryName: "",
  subCategories: [
    // {
    //   id: "",
    //   name: "",
    // },
  ],
};

const CategoryDetailModal = ({ modalState, setModalState }) => {
  const dispatch = useDispatch();

  const [listSub, setListSub] = useState(initListSub);
  const [categoryState, setCategoryState] = useState(initCategoryState);
  const [errMessage, setErrMessage] = useState(initErrMessage);
  const [isLoading, setIsLoading] = useState(false);
  const [countDefaultSub, setCountDefaultSub] = useState(0);
  const idCateInputRef = useRef();

  useEffect(() => {
    if (
      modalState.rowSelected &&
      modalState.visible &&
      modalState.type != "create"
    ) {
      setCountDefaultSub(modalState.rowSelected.SubCategories.length);
      setCategoryState({
        id: modalState.rowSelected.id,
        name: modalState.rowSelected.name,
        state: modalState.rowSelected.state,
        image: modalState.rowSelected.image,
      });

      let _sublist = modalState.rowSelected.SubCategories.map((item) => {
        return {
          id: item.id,
          name: item.name,
          state: item.state,
          isExistOnDB: true,
        };
      });

      let _subErr = [];
      _sublist.map((item) => {
        _subErr.push({
          id: "",
          name: "",
        });
      });

      setErrMessage({
        ...errMessage,
        subCategories: _subErr,
      });

      setListSub(_sublist);
    }

    if (idCateInputRef.current) {
      idCateInputRef.current.focus();
    }

    return () => {};
  }, [modalState.rowSelected]);

  async function onSubmit(type, isClose) {
    let hideLoading = message.loading("Đang tải...", 0);
    if (await checkForm(type)) {
      let subCategories = listSub.map((item) => {
        return {
          id: item.id,
          name: item.name,
          state: item.state,
        };
      });

      let formData = {
        id: categoryState.id,
        name: categoryState.name,
        image:
          "https://vinmec-prod.s3.amazonaws.com/images/20211218_114300_993458_an-tao-luc-nao-tot-.max-1800x1800.jpg",
        state: categoryState.state,
        subCategories,
      };

      let res = null;
      if (type == "create") {
        res = await cateApi.addOne(formData);
      } else {
        res = await cateApi.updateOne(formData);
      }

      if (res.isSuccess) {
        if (type == "create") message.info("Thêm mới nhóm thành công");

        if (type == "update") message.info("Cập nhật nhóm thành công");

        dispatch(setRefreshCate());
      }

      if (res.isSuccess) {
        if (isClose) {
          setModalState({
            ...modalState,
            visible: false,
          });
          clearForm();
        } else {
          clearForm();
        }
      } else {
        message.warning("Thông tin cung cấp không hợp lệ!");
      }
    } else {
      message.warning("Thông tin cung cấp không hợp lệ!");
    }
    hideLoading();
  }

  //validate form before submit
  async function checkForm(type) {
    let isCheck = true;
    let _errMess = { ...errMessage };

    if (!categoryState.id) {
      _errMess.categoryId = "Không được bỏ trống";
      isCheck = false;
    }

    if (!categoryState.name) {
      _errMess.categoryName = "Không được bỏ trống";
      isCheck = false;
    }

    if (type == "create") {
      let res = await cateApi.findCategoryById(categoryState.id);
      if (res.isSuccess) {
        _errMess.categoryId = "Mã này đã tồn tại";
        isCheck = false;
      }
    }

    let _subErr = [];
    if (errMessage.subCategories) {
      _subErr = [...errMessage.subCategories];
    }
    for (let i = 0; i < listSub.length; i++) {
      if (!listSub[i].id) {
        _subErr[i].id = "Không được bỏ trống";
        isCheck = false;
      } else if (!listSub[i].isExistOnDB) {
        let res = await cateApi.findSubById(listSub[i].id);
        if (res.isSuccess) {
          _subErr[i].id = "Mã này đã tồn tại";
          isCheck = false;
        }
      }
      if (!listSub[i].name) {
        _subErr[i].name = "Không được bỏ trống";
        isCheck = false;
      }
    }
    _errMess.subCategories = _subErr;
    setErrMessage(_errMess);

    return isCheck;
  }

  function clearForm() {
    setErrMessage(initErrMessage);
    setCategoryState(initCategoryState);
    setListSub(initListSub);
  }

  function onCloseModal() {
    clearForm();
    setModalState({
      ...modalState,
      visible: false,
    });
  }

  return (
    <>
      <ModalCustomer
        visible={modalState.visible}
        setVisible={onCloseModal}
        isLoading={isLoading}
        closeModal={() => {
          onCloseModal();
        }}
      >
        <div className="category_modal">
          <Typography.Title level={4} className="title">
            {modalState.type == "update"
              ? "Cập nhật thông tin nhóm hàng"
              : "Thêm mới nhóm hàng"}
          </Typography.Title>
          <div className="form__container">
            <div className="form__wrap">
              {/* <div className="input_container">
                <UploadImageProduct />
              </div> */}
              <div className="category_modal_left">
                <div className="input_container">
                  <Text className="label">Mã nhóm</Text>
                  <div className="input_wrap">
                    <Input
                      ref={idCateInputRef}
                      className="input"
                      placeholder="NL12"
                      size="small"
                      value={categoryState.id}
                      onChange={({ target }) => {
                        setCategoryState({
                          ...categoryState,
                          id: target.value,
                        });
                      }}
                      status={errMessage.categoryId && "error"}
                      disabled={
                        modalState.type == "update" || modalState.type == "view"
                      }
                    />

                    <span className="input_error">{errMessage.categoryId}</span>
                  </div>
                </div>
                <div className="input_container">
                  <Text className="label">Tên nhóm</Text>
                  <div className="input_wrap">
                    <Input
                      className="input"
                      placeholder=" Nước giải khát  "
                      size="small"
                      value={categoryState.name}
                      onChange={({ target }) => {
                        setCategoryState({
                          ...categoryState,
                          name: target.value,
                        });
                      }}
                      status={errMessage.categoryName && "error"}
                      disabled={modalState.type == "view"}
                    />
                    <span className="input_error">
                      {errMessage.categoryName}
                    </span>
                  </div>
                </div>
                <div className="input_container">
                  <Text className="label">Trạng thái</Text>
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    checked={categoryState.state}
                    onChange={(is) => {
                      setCategoryState({
                        ...categoryState,
                        state: is,
                      });
                    }}
                    disabled={modalState.type == "view"}
                  />
                </div>
              </div>

              <div className="category_modal_right">
                <Typography.Title level={5}>
                  Danh sách nhóm con (c2)
                </Typography.Title>

                <div className="category_sub_list">
                  <div className="sub_input_container">
                    <Text className="sub_input_label">Mã nhóm (c2)</Text>
                    <Text className="sub_input_label">Tên nhóm (c2)</Text>
                    <Text className="sub_input_state">Trạng thái</Text>
                  </div>
                  {listSub &&
                    listSub.map((item, index) => {
                      return (
                        <div className="sub_input_container">
                          <div className="sub_input_wrap">
                            <Input
                              className="input"
                              placeholder=" NGK"
                              size="small"
                              value={listSub[index]?.id}
                              onChange={({ target }) => {
                                let _lst = [...listSub];
                                _lst[index].id = target.value;
                                setListSub(_lst);
                              }}
                              disabled={
                                item.isExistOnDB || modalState.type == "view"
                              }
                              style={{
                                marginRight: "24px",
                              }}
                              status={
                                errMessage.subCategories[index]?.id && "error"
                              }
                            />
                            <div className="sub_input_error">
                              {errMessage.subCategories[index]?.id}{" "}
                            </div>
                          </div>
                          <div className="sub_input_wrap">
                            <Input
                              className="input"
                              placeholder=" Nước giải khát  "
                              size="small"
                              value={listSub[index]?.name}
                              onChange={({ target }) => {
                                let _lst = [...listSub];
                                _lst[index].name = target.value;
                                setListSub(_lst);
                              }}
                              disabled={modalState.type == "view"}
                              status={
                                errMessage.subCategories[index]?.name && "error"
                              }
                            />
                            <div className="sub_input_error">
                              {errMessage.subCategories[index]?.name}
                            </div>
                          </div>
                          <Switch
                            className="switch"
                            checkedChildren="On"
                            unCheckedChildren="Off"
                            checked={item.state}
                            onChange={(is) => {
                              let _lst = [...listSub];
                              _lst[index].state = is;
                              setListSub(_lst);
                            }}
                            disabled={modalState.type == "view"}
                          />
                          <div className="icon_delete">
                            <Button
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => {
                                let _lst = [...listSub];
                                _lst = _lst.filter((_, ind) => ind != index);
                                setListSub(_lst);

                                let _subErr = errMessage.subCategories.filter(
                                  (_, ind) => ind != index
                                );

                                setErrMessage({
                                  ...errMessage,
                                  subCategories: _subErr,
                                });
                              }}
                              disabled={
                                (modalState.type == "update" &&
                                  index < countDefaultSub) ||
                                modalState.type == "view"
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
                <Button
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setListSub([
                      ...listSub,
                      {
                        id: "",
                        name: "",
                        state: true,
                      },
                    ]);

                    setErrMessage({
                      ...errMessage,
                      subCategories: [
                        ...errMessage.subCategories,
                        {
                          id: "",
                          name: "",
                        },
                      ],
                    });
                  }}
                  disabled={modalState.type == "view"}
                >
                  Thêm mới
                </Button>
              </div>
            </div>

            <Space
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
                paddingTop: "12px",
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
                <>
                  {modalState.type != "view" && (
                    <Button
                      type="primary"
                      onClick={() => {
                        onSubmit("update", true);
                      }}
                    >
                      Cập nhật
                    </Button>
                  )}
                </>
              )}
              <Button type="primary" danger onClick={() => onCloseModal()}>
                Hủy bỏ
              </Button>
            </Space>
          </div>
        </div>
      </ModalCustomer>
    </>
  );
};

export default CategoryDetailModal;
