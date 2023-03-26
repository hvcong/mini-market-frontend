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
import ProductGiftPromotion from "./ProductGiftPromotion";
import MoneyProductPromotion from "./MoneyProductPromotion";
import DiscountRatePromotion from "./DiscountRatePromotion";
import VoucherPromotion from "./VoucherPromotion";
import { setRefreshPromotionLines } from "../../store/slices/promotionLineSlice";
import productApi from "../../api/productApi";
import { uid } from "../../utils";

const initFormState = {
  id: "",
  typePromotionId: "",
  startDate: "",
  endDate: "",
  title: "",
  description: "",
  state: true,
  PP: {
    productId1: "",
    ut1: "",
    milestones: 1,
    productId2: "",
    ut2: "",
    quantity: 1,
    state: true,
  },
  DRP: {
    productId: "",
    ut: "",
    discountRate: 0,
    state: true,
  },
  MP: {
    minCost: 1,
    discountMoney: 0,
    discountRate: 0,
    maxDiscountMoney: 1,
    state: true,
  },
  V: {
    code: "",
    discountMoney: 0,
    discountRate: 0,
    maxDiscountMoney: 1,
    state: true,
  },
};
const initErrMessage = {
  id: "",
  typePromotionId: "",
  time: "",
  title: "",
  description: "",
  state: true,
  PP: {
    productId1: "",
    ut1: "",
    milestones: "",
    productId2: "",
    ut2: "",
    quantity: "",
    state: true,
  },
  DRP: {
    productId: "",
    ut: "",
    discountRate: "",
    state: true,
  },
  MP: {
    minCost: "",
    discountMoney: "",
    discountRate: "",
    maxDiscountMoney: "",
    state: true,
  },
  V: {
    code: "",
    discountMoney: "",
    discountRate: "",
    maxDiscountMoney: "",
    state: true,
  },
};

const typePromotionData = [
  {
    value: "PP",
    label: "Mua sản phẩm tặng sản phẩm",
  },
  {
    value: "DRP",
    label: "Giảm giá sản phẩm",
  },
  {
    value: "MP",
    label: "Giảm tiền theo hóa đơn",
  },
  {
    value: "V",
    label: "Phiếu giảm giá",
  },
];

const PromotionLineModal = ({
  modalState,
  setModalState,
  promotionHeaderId,
}) => {
  let hideLoading = null;
  const dispatch = useDispatch();

  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);

  useEffect(() => {
    const { type, rowSelected, visible } = modalState;

    if (type == "update" && rowSelected && visible) {
      loadPromotionLine(rowSelected.id, rowSelected.type);
    }

    return () => {};
  }, [modalState]);

  async function loadPromotionLine(id, type) {
    if (type == "PP") {
      let res = await promotionApi.getOnePPById(id);
      if (res.isSuccess) {
        setFormState({
          id: "",
          typePromotionId: type,
          time: "",
          title: "",
          description: "",
          state: true,
          PP: {
            productId1: "",
            ut1: "",
            milestones: "",
            productId2: "",
            ut2: "",
            quantity: "",
            state: true,
          },
          DRP: {
            productId: "",
            ut: "",
            discountRate: "",
            state: true,
          },
          MP: {
            minCost: "",
            discountMoney: "",
            discountRate: "",
            maxDiscountMoney: "",
            state: true,
          },
          V: {
            code: "",
            discountMoney: "",
            discountRate: "",
            maxDiscountMoney: "",
            state: true,
          },
        });
      }
    }

    if (type == "MP") {
      let res = await promotionApi.getOneMPById(id);
      if (res.isSuccess) {
        setFormState({
          id: "",
          typePromotionId: type,
          time: "",
          title: "",
          description: "",
          state: true,
          PP: {
            productId1: "",
            ut1: "",
            milestones: "",
            productId2: "",
            ut2: "",
            quantity: "",
            state: true,
          },
          DRP: {
            productId: "",
            ut: "",
            discountRate: "",
            state: true,
          },
          MP: {
            minCost: "",
            discountMoney: "",
            discountRate: "",
            maxDiscountMoney: "",
            state: true,
          },
          V: {
            code: "",
            discountMoney: "",
            discountRate: "",
            maxDiscountMoney: "",
            state: true,
          },
        });
      }
    }

    if (type == "DRP") {
      let res = await promotionApi.getOneDRPById(id);
      if (res.isSuccess) {
        setFormState({
          id: "",
          typePromotionId: type,
          time: "",
          title: "",
          description: "",
          state: true,
          PP: {
            productId1: "",
            ut1: "",
            milestones: "",
            productId2: "",
            ut2: "",
            quantity: "",
            state: true,
          },
          DRP: {
            productId: "",
            ut: "",
            discountRate: "",
            state: true,
          },
          MP: {
            minCost: "",
            discountMoney: "",
            discountRate: "",
            maxDiscountMoney: "",
            state: true,
          },
          V: {
            code: "",
            discountMoney: "",
            discountRate: "",
            maxDiscountMoney: "",
            state: true,
          },
        });
      }
    }

    if (type == "V") {
      let res = await promotionApi.getOneVById(id);
      if (res.isSuccess) {
        setFormState({
          id: "",
          typePromotionId: type,
          time: "",
          title: "",
          description: "",
          state: true,
          PP: {
            productId1: "",
            ut1: "",
            milestones: "",
            productId2: "",
            ut2: "",
            quantity: "",
            state: true,
          },
          DRP: {
            productId: "",
            ut: "",
            discountRate: "",
            state: true,
          },
          MP: {
            minCost: "",
            discountMoney: "",
            discountRate: "",
            maxDiscountMoney: "",
            state: true,
          },
          V: {
            code: "",
            discountMoney: "",
            discountRate: "",
            maxDiscountMoney: "",
            state: true,
          },
        });
      }
    }
  }

  async function onSubmit(type, isClose) {
    let res = {};
    if (modalState.type == "update") {
      hideLoading = message.loading("Đang cập nhật...", 0);
    }
    if (modalState.type == "create") {
      hideLoading = message.loading("Đang tạo mới...", 0);
    }
    setErrMessage({
      PP: {},
      DRP: {},
      MP: {},
      V: {},
    });
    if (await checkData()) {
      // validate oke

      //// create and update PP
      let formData = {};
      if (formState.typePromotionId == "PP") {
        let { PP } = formState;

        let putId = await getPUTid(PP.productId1, PP.ut1);
        let putId2 = await getPUTid(PP.productId2, PP.ut2);

        if (type == "create") {
          formData = {
            id: formState.id,
            title: formState.title,
            description: formState.description,
            startDate: formState.startDate,
            endDate: formState.endDate,
            minQuantity: PP.milestones,
            state: formState.state,
            ProductUnitTypeId: putId,
            PromotionHeaderId: promotionHeaderId,
          };

          res = await promotionApi.addOnePP(formData);
          if (res.isSuccess) {
            formData = {
              id: uid(),
              quantity: PP.quantity,
              ProductUnitTypeId: putId2,
              ProductPromotionId: formState.id,
            };
            console.log(formData);
            res = await promotionApi.addOneGift(formData);
          }
        }
      }

      //// create and update  DRP
      if (formState.typePromotionId == "DRP") {
        let { DRP } = formState;

        let putId = await getPUTid(DRP.productId, DRP.ut);
        console.log(putId);
        formData = {
          id: formState.id,
          startDate: formState.startDate,
          endDate: formState.endDate,
          discountRate: DRP.discountRate,
          state: formState.state,
          PromotionHeaderId: promotionHeaderId,
          ProductUnitTypeId: putId,
        };
        console.log(formData);
        res = await promotionApi.addOneDRP(formData);
      }

      //// create and update MP
      if (formState.typePromotionId == "MP") {
        let { MP } = formState;

        if (type == "create") {
          formData = {
            id: formState.id,
            title: formState.title,
            description: formState.description,
            startDate: formState.startDate,
            endDate: formState.endDate,
            minCost: MP.minCost,
            discountMoney: MP.discountMoney,
            discountRate: MP.discountRate,
            maxDiscountMoney: MP.maxDiscountMoney,
            state: MP.state,
            PromotionHeaderId: promotionHeaderId,
          };
          res = await promotionApi.addOneMP(formData);
        }
      }

      ////create and update V

      if (formState.typePromotionId == "V") {
        let { V } = formState;

        if (type == "create") {
          formData = {
            code: V.code,
            startDate: formState.startDate,
            endDate: formState.endDate,
            state: formState.state,
            discountMoney: V.discountMoney,
            discountRate: V.discountRate,
            maxDiscountMoney: V.maxDiscountMoney,
            PromotionHeaderId: promotionHeaderId,
          };

          console.log(formData);
          res = await promotionApi.addOneV(formData);
        }
      }

      if (res.isSuccess) {
        //  api oke
        if (modalState.type == "create") {
          // create oke
          message.info("Thêm mới dòng khuyến mãi thành công");
          dispatch(setRefreshPromotionLines());
          if (isClose) {
            closeModal();
          } else {
            clearModal();
          }
        } else {
          // update oke
          message.info("Cập nhật dòng khuyến mãi thành công");
          dispatch(setRefreshPromotionLines());
        }
      } else {
        // api faild
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }

    hideLoading();
    async function checkData() {
      let isCheck = true;
      let _errMess = {
        PP: {},
        DRP: {},
        MP: {},
        V: {},
      };

      if (!formState.id) {
        _errMess.id = "Không được bỏ trống!";
      }

      if (!formState.typePromotionId) {
        _errMess.typePromotionId = "Không được bỏ trống!";
      }

      if (!formState.startDate || !formState.endDate) {
        _errMess.time = "Không được bỏ trống!";
      }

      if (!formState.title) {
        _errMess.title = "Không được bỏ trống!";
      }

      // check for PP
      let { PP } = formState;
      // tạo gift product trước
      if (PP && formState.typePromotionId == "PP") {
        if (!PP.productId1) {
          _errMess.PP.productId1 = "Không được bỏ trống";
        }

        if (!PP.ut1) {
          _errMess.PP.ut1 = "Không được bỏ trống";
        }

        if (!PP.milestones) {
          _errMess.PP.milestones = "Không được bỏ trống";
        }

        if (!PP.productId2) {
          _errMess.PP.productId2 = "Không được bỏ trống";
        }

        if (!PP.ut2) {
          _errMess.PP.ut2 = "Không được bỏ trống";
        }

        if (!PP.quantity) {
          _errMess.PP.quantity = "Không được bỏ trống";
        }
      }

      // check for MP
      let { MP } = formState;
      if (MP && formState.typePromotionId == "MP") {
        console.log("here");
        if (!MP.minCost) {
          _errMess.MP.minCost = "Không được bỏ trống!";
        }
        if (MP.discountMoney == 0 && MP.discountRate == 0) {
          _errMess.MP.discountMoney =
            "Số tiền chiết khấu hoặc % chiết khấu phải > 0!";
          _errMess.MP.discountRate =
            "Số tiền chiết khấu hoặc % chiết khấu phải > 0!";
        }
        if (!MP.maxDiscountMoney) {
          _errMess.MP.maxDiscountMoney = "Không được bỏ trống!";
        }
      }

      // check for DRP
      let { DRP } = formState;
      if (DRP && formState.typePromotionId == "DRP") {
        if (!DRP.productId) {
          _errMess.DRP.productId = "Không được bỏ trống!";
        }
        if (!DRP.ut) {
          _errMess.DRP.ut = "Không được bỏ trống!";
        }
        if (!DRP.discountRate) {
          _errMess.DRP.discountRate = "Giá trị phải > 0 và <=100";
        }
      }

      // check for V
      let { V } = formState;
      if (V && formState.typePromotionId == "V") {
        if (!V.code) {
          _errMess.V.code = "Không được bỏ trống!";
        }
        if (V.discountMoney == 0 && V.discountRate == 0) {
          _errMess.V.discountMoney =
            "Số tiền chiết khấu hoặc % chiết khấu phải > 0!";
          _errMess.V.discountRate =
            "Số tiền chiết khấu hoặc % chiết khấu phải > 0!";
        }
        if (V.maxDiscountMoney <= 0) {
          _errMess.V.maxDiscountMoney = "Phải lớn hơn 0!";
        }
      }

      Object.keys(_errMess).map((key) => {
        if (key == "PP") {
          Object.keys(_errMess.PP).map((PPKey) => {
            if (_errMess.PP[PPKey]) {
              isCheck = false;
            }
          });
        } else if (key == "MP") {
          Object.keys(_errMess.MP).map((MPKey) => {
            if (_errMess.MP[MPKey]) {
              isCheck = false;
            }
          });
        } else if (key == "DRP") {
          Object.keys(_errMess.DRP).map((DRPKey) => {
            if (_errMess.DRP[DRPKey]) {
              isCheck = false;
            }
          });
        } else if (key == "V") {
          Object.keys(_errMess.V).map((VKey) => {
            if (_errMess.V[VKey]) {
              isCheck = false;
            }
          });
        } else if (_errMess[key]) {
          isCheck = false;
        }
      });

      setErrMessage(_errMess);
      return isCheck;
    }
  }

  async function getPUTid(productId, utId) {
    let res = await productApi.findOneById(productId);
    if (!res.isSuccess) {
      return;
    }

    let putId = res.product.ProductUnitTypes.filter(
      (item) => item.UnitTypeId == utId
    )[0].id;
    return putId;
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
    <div className="promotion_line_modal">
      <ModalCustomer
        visible={modalState.visible}
        style={{
          width: "869px",
        }}
      >
        <div>
          <div className="title__container">
            <Typography.Title level={4} className="title">
              {modalState.type == "update"
                ? "Cập nhật thông tin một dòng khuyến mãi"
                : "Thêm mới một dòng khuyến mãi"}
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="promotion_line_form">
              <div className="promotion_line_form_top">
                <div className="promotion_line_form_left">
                  <div className="promotion_line_form_group">
                    <div className="promotion_line_form_label">Mã KM</div>
                    <div className="promotion_line_form_input_wrap">
                      <Input
                        className="promotion_line_form_input"
                        size="small"
                        disabled={modalState.type == "update"}
                        value={formState.id}
                        status={errMessage.id && "error"}
                        onChange={({ target }) => {
                          setFormState({
                            ...formState,
                            id: target.value,
                          });
                        }}
                      />
                      <div className="promotion_line_form_input_err">
                        {errMessage.id}
                      </div>
                    </div>
                  </div>
                  <div className="promotion_line_form_group">
                    <div className="promotion_line_form_label">
                      Loại khuyến mãi
                    </div>
                    <div className="promotion_line_form_input_wrap">
                      <Select
                        className="promotion_line_form_input"
                        size="small"
                        options={typePromotionData}
                        value={formState.typePromotionId}
                        status={errMessage.typePromotionId && "error"}
                        onChange={(value) => {
                          setFormState({
                            ...formState,
                            typePromotionId: value,
                          });
                        }}
                        disabled={modalState.type == "update"}
                      />
                      <div className="promotion_line_form_input_err">
                        {errMessage.typePromotionId}
                      </div>
                    </div>
                  </div>
                  <div className="promotion_line_form_group">
                    <div className="promotion_line_form_label">Thời gian</div>
                    <div className="promotion_line_form_input_wrap">
                      <DatePickerCustom
                        className="promotion_line_form_input"
                        size="small"
                        value={[formState.startDate, formState.endDate]}
                        status={errMessage.time && "error"}
                        onChangeDate={(strings) => {
                          if (strings) {
                            setFormState({
                              ...formState,
                              startDate: strings[0],
                              endDate: strings[1],
                            });
                          }
                        }}
                      />
                      <div className="promotion_line_form_input_err">
                        {errMessage.time}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="promotion_line_form_right">
                  <div className="promotion_line_form_group">
                    <div className="promotion_line_form_label">Tiêu đề</div>
                    <div className="promotion_line_form_input_wrap">
                      <Input
                        className="promotion_line_form_input"
                        size="small"
                        value={formState.title}
                        status={errMessage.title && "error"}
                        onChange={({ target }) => {
                          setFormState({
                            ...formState,
                            title: target.value,
                          });
                        }}
                      />
                      <div className="promotion_line_form_input_err">
                        {errMessage.title}
                      </div>
                    </div>
                  </div>
                  <div className="promotion_line_form_group">
                    <div className="promotion_line_form_label">Mô tả</div>
                    <div className="promotion_line_form_input_wrap">
                      <Input.TextArea
                        className="promotion_line_form_input"
                        showCount
                        maxLength={200}
                        style={{
                          height: 28,
                          marginBottom: 12,
                        }}
                        size="small"
                        placeholder="Mô tả về dòng khuyến mãi"
                        value={formState.description}
                        onChange={({ target }) => {
                          setFormState({
                            ...formState,
                            description: target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="promotion_line_form_group">
                    <div className="promotion_line_form_label">Trạng thái</div>
                    <div className="promotion_line_form_input_wrap">
                      <Switch
                        size="small"
                        checked={formState.state}
                        onChange={(value) => {
                          setFormState({
                            ...formState,
                            state: value,
                          });
                        }}
                      />
                      <div className="promotion_line_form_input_err"></div>
                    </div>
                  </div>
                </div>
              </div>

              {formState.typePromotionId && (
                <div className="promotion_line_form_bottom_container">
                  {formState.typePromotionId == "PP" && (
                    <ProductGiftPromotion
                      modalType={modalState.type}
                      formState={formState.PP}
                      setFormState={(value) => {
                        setFormState({
                          ...formState,
                          PP: value,
                        });
                      }}
                      errMessage={errMessage.PP}
                      setErrMessage={(value) => {
                        setErrMessage({
                          ...errMessage,
                          PP: value,
                        });
                      }}
                    />
                  )}
                  {formState.typePromotionId == "MP" && (
                    <MoneyProductPromotion
                      modalType={modalState.type}
                      formState={formState.MP}
                      setFormState={(value) => {
                        setFormState({
                          ...formState,
                          MP: value,
                        });
                      }}
                      errMessage={errMessage.MP}
                      setErrMessage={(value) => {
                        setErrMessage({
                          ...errMessage,
                          MP: value,
                        });
                      }}
                    />
                  )}
                  {formState.typePromotionId == "DRP" && (
                    <DiscountRatePromotion
                      modalType={modalState.type}
                      formState={formState.DRP}
                      setFormState={(value) => {
                        setFormState({
                          ...formState,
                          DRP: value,
                        });
                      }}
                      errMessage={errMessage.DRP}
                      setErrMessage={(value) => {
                        setErrMessage({
                          ...errMessage,
                          DRP: value,
                        });
                      }}
                    />
                  )}
                  {formState.typePromotionId == "V" && (
                    <VoucherPromotion
                      modalType={modalState.type}
                      formState={formState.V}
                      setFormState={(value) => {
                        setFormState({
                          ...formState,
                          V: value,
                        });
                      }}
                      errMessage={errMessage.V}
                      setErrMessage={(value) => {
                        setErrMessage({
                          ...errMessage,
                          V: value,
                        });
                      }}
                    />
                  )}
                </div>
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
                    Lưu & Thêm mới dòng khuyến mãi
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

export default PromotionLineModal;
