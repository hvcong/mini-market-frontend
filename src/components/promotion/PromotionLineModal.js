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
import { useDispatch, useSelector } from "react-redux";
import ImageUpload from "./ImageUpload";
import DropSelectColum from "../product/DropSelectColum";
import { PlusOutlined } from "@ant-design/icons";
import DatePickerCustom from "./DatePickerCustom";
import promotionApi from "./../../api/promotionApi";
import CustomerGroupSelect from "./../customerGroup/CustomerGroupSelect";
import ProductGiftPromotion from "./ProductGiftPromotion";
import MoneyProductPromotion from "./MoneyProductPromotion";
import DiscountRatePromotion from "./DiscountRatePromotion";
import VoucherPromotion from "./VoucherPromotion";
import { setRefreshPromotionLines } from "../../store/slices/promotionLineSlice";
import productApi from "../../api/productApi";
import {
  antdToYmd,
  codeVocherGenarate,
  compareDMY,
  sqlToAntd,
  uid,
} from "../../utils";
import { setOpen } from "../../store/slices/modalSlice";
import VoucherPromotionDetail from "./VoucherPromotionDetail";

const initFormState = {
  id: uid(),
  typePromotionId: "V",
  startDate: "",
  endDate: "",
  title: "",
  description: "",
  state: true,
  PP: {
    productId1: "",
    ut1: "",
    minQuantity: 1,
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
    maxMoneyDiscount: 1,
    state: true,
    type: "discountMoney",
    budget: 0,
    availableBudget: 0,
  },
  V: {
    code: codeVocherGenarate(),
    discountMoney: 0,
    discountRate: 0,
    maxDiscountMoney: 0,
    type: "discountMoney",
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
    minQuantity: "",
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
    maxMoneyDiscount: "",
    state: true,
    type: "",
    budget: "",
    availableBudget: "",
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

const initListVoucherCreate = [
  {
    isLastRow: true,
  },
];

const initListVoucherErrMessage = {};

const PromotionLineModal = () => {
  let hideLoading = null;
  const dispatch = useDispatch();
  const modalState = useSelector(
    (state) => state.modal.modals["PromotionLineModal"]
  );
  const promotionHeaderId = modalState.promotionHeaderId;

  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);
  const [minMaxTime, setMinMaxTime] = useState();
  const [listVoucherCreate, setListVoucherCreate] = useState(
    initListVoucherCreate
  );
  const [lvErrMessage, setLvErrMessage] = useState(initListVoucherErrMessage);

  useEffect(() => {
    const { type, idSelected, visible } = modalState;
    if (visible) {
      loadMinMaxTime();
    }

    if (idSelected && visible) {
      loadPromotionLine(idSelected);
    }

    return () => {};
  }, [modalState]);

  useEffect(() => {
    if (modalState.type == "create" && modalState.visible && minMaxTime) {
      let now = new Date();
      let min = new Date(minMaxTime.min);
      let max = new Date(minMaxTime.max);

      setFormState({
        ...formState,
        startDate:
          compareDMY(min, now) > 0 ? min : now.setDate(now.getDate() + 1),
        endDate: max,
      });
    }
    return () => {};
  }, [minMaxTime]);

  // useEffect(() => {
  //   if (formState.V) {
  //     formState.V.code = codeVocherGenarate();
  //   }
  //   return () => {};
  // }, [formState.typePromotionId]);

  async function loadPromotionLine(id) {
    let type = "";
    let res = {};
    res = await promotionApi.getOnePPById(id);
    if (res.isSuccess) {
      let productPromotion = res.productPromotion;
      type = "PP";
      setFormState({
        ...productPromotion,
        typePromotionId: type,
        PP: {
          productId1: productPromotion.ProductUnitType.ProductId,
          ut1: productPromotion.ProductUnitType.UnitTypeId,
          minQuantity: productPromotion.minQuantity,
          productId2: productPromotion.GiftProduct.ProductUnitType.ProductId,
          ut2: productPromotion.GiftProduct.ProductUnitType.UnitTypeId,
          quantity: productPromotion.GiftProduct.quantity,
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
          maxMoneyDiscount: "",
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

    res = await promotionApi.getOneMPById(id);
    if (res.isSuccess) {
      type = "MP";
      let moneyPromotion = res.moneyPromotion || {};
      setFormState({
        ...moneyPromotion,
        typePromotionId: "MP",

        PP: {
          productId1: "",
          ut1: "",
          minQuantity: "",
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
          ...moneyPromotion,
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

    res = await promotionApi.getOneDRPById(id);
    if (res.isSuccess) {
      type = "DRP";
      let discountRate = res.discountRate;
      setFormState({
        ...discountRate,
        typePromotionId: type,
        PP: {
          productId1: "",
          ut1: "",
          minQuantity: "",
          productId2: "",
          ut2: "",
          quantity: "",
        },
        DRP: {
          productId: discountRate.ProductUnitType.ProductId,
          ut: discountRate.ProductUnitType.UnitTypeId,
          discountRate: discountRate.discountRate,
        },
        MP: {
          minCost: "",
          discountMoney: "",
          discountRate: "",
          maxMoneyDiscount: "",
        },
        V: {
          code: "",
          discountMoney: "",
          discountRate: "",
          maxMoneyDiscount: "",
        },
      });
    }

    res = await promotionApi.getOneVById(id);
    if (res.isSuccess) {
      type = "V";
      let voucher = res.voucher;
      setFormState({
        ...voucher,
        id: voucher.groupVoucher,
        typePromotionId: type,

        PP: {
          productId1: "",
          ut1: "",
          minQuantity: "",
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
          ...voucher,
        },
      });
    }
  }

  async function loadMinMaxTime() {
    let res = await promotionApi.getOneHeaderById(promotionHeaderId);
    if (res.isSuccess) {
      let startDate = res.promotion.startDate;
      let endDate = res.promotion.endDate;
      setMinMaxTime({
        min: startDate,
        max: endDate,
      });
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
      let isFuture = false;
      let start = new Date(formState.startDate);
      let now = new Date();

      if (compareDMY(start, now) > 0) {
        // Sắp tới
        isFuture = true;
      }

      res = {};
      // validate oke

      let formData = {};
      //// create and update PP
      if (formState.typePromotionId == "PP") {
        let { PP } = formState;

        let putId = await getPUTid(PP.productId1, PP.ut1);
        let putId2 = await getPUTid(PP.productId2, PP.ut2);

        formData = {
          id: formState.id,
          title: formState.title,
          description: formState.description,
          startDate: formState.startDate,
          endDate: formState.endDate,
          minQuantity: PP.minQuantity,
          state: formState.state,
          ProductUnitTypeId: putId,
          PromotionHeaderId: promotionHeaderId,
        };
        if (type == "create") {
          res = await promotionApi.addOnePP(formData);
          if (res.isSuccess) {
            formData = {
              id: uid(),
              quantity: PP.quantity,
              ProductUnitTypeId: putId2,
              ProductPromotionId: formState.id,
            };
            res = await promotionApi.addOneGift(formData);
          }
        } else {
          // update

          /**
           * Khi khuyến mãi đang sử dụng
           */
          if (!isFuture) {
            let { id, ...updateForm } = formData;
            res = await promotionApi.updateOnePP(id, updateForm);
          } else {
            // cập nhật tương lai
            let id = formState.id;

            await promotionApi.deleteOnePP(id);

            res = await promotionApi.addOnePP(formData);
            if (res.isSuccess) {
              formData = {
                id: uid(),
                quantity: PP.quantity,
                ProductUnitTypeId: putId2,
                ProductPromotionId: formState.id,
              };
              res = await promotionApi.addOneGift(formData);
            }
          }
        }
      }

      //// create and update  DRP
      if (formState.typePromotionId == "DRP") {
        let { DRP } = formState;

        let putId = await getPUTid(DRP.productId, DRP.ut);
        formData = {
          id: formState.id,
          startDate: formState.startDate,
          endDate: formState.endDate,
          title: formState.title,
          description: formState.description,
          discountRate: DRP.discountRate,
          state: formState.state,
          PromotionHeaderId: promotionHeaderId,
          ProductUnitTypeId: putId,
        };
        if (type == "create") {
          res = await promotionApi.addOneDRP(formData);
        } else {
          let id = formState.id;
          // update đang sử dụng
          if (!isFuture) {
            let { id, ...updateForm } = formData;
            res = await promotionApi.updateOneDRP(id, updateForm);
          } else {
            await promotionApi.deleteOneDRP(id);
            res = await promotionApi.addOneDRP(formData);
            //console.log(res);
          }
        }
      }

      //// create and update MP
      if (formState.typePromotionId == "MP") {
        let { MP } = formState;
        formData = {
          id: formState.id,
          title: formState.title,
          description: formState.description,
          startDate: formState.startDate,
          endDate: formState.endDate,
          minCost: MP.minCost,
          discountMoney: MP.type == "discountMoney" ? MP.discountMoney : 0,
          discountRate: MP.type == "discountRate" ? MP.discountRate : 0,
          maxMoneyDiscount: MP.type == "discountRate" ? MP.maxMoneyDiscount : 0,
          state: MP.state,
          type: MP.type,
          budget: MP.budget,
          availableBudget: MP.budget,
          PromotionHeaderId: promotionHeaderId,
        };

        if (type == "create") {
          res = await promotionApi.addOneMP(formData);
        } else {
          let id = formState.id;
          //update đagn sử dụng
          if (!isFuture) {
            let { id, ...updateForm } = formData;
            res = await promotionApi.updateOneMP(id, updateForm);
          } else {
            // update tương lai
            await promotionApi.deleteOneMP(id);
            res = await promotionApi.addOneMP(formData);
          }
        }
      }

      ////create and update V

      if (formState.typePromotionId == "V") {
        let { V } = formState;
        if (type == "create") {
          for (const voucher of listVoucherCreate) {
            if (voucher.isLastRow) continue;
            formData = {
              id: uid() + uid(),
              code: voucher.code,
              startDate: formState.startDate,
              title: formState.title,
              description: formState.description,
              endDate: formState.endDate,
              state: formState.state,
              discountMoney: voucher.discountMoney,
              discountRate: voucher.discountRate,
              type: voucher.type,
              maxDiscountMoney: voucher.maxDiscountMoney,
              PromotionHeaderId: promotionHeaderId,
              groupVoucher: formState.id,
            };
            try {
              res = await promotionApi.addOneV(formData);
            } catch (error) {
              message.error("Có lỗi xảy ra, vui lòng thử lại");
            }
          }
        } else {
          // update voucher

          // bảng giá tương lai
          // xoa tat ca bang group voucher
          if (isFuture) {
            res = await promotionApi.deleteByGroup(formState.id);
            for (const voucher of listVoucherCreate) {
              if (voucher.isLastRow) continue;

              // tạo mới những voucher có trong list
              let newVoucherFormData = {
                id: uid() + uid(),
                code: voucher.code,
                startDate: formState.startDate,
                title: formState.title,
                description: formState.description,
                endDate: formState.endDate,
                state: formState.state,
                discountMoney: voucher.discountMoney,
                discountRate: voucher.discountRate,
                type: voucher.type,
                maxDiscountMoney: voucher.maxDiscountMoney,
                PromotionHeaderId: promotionHeaderId,
                groupVoucher: formState.id,
              };

              try {
                res = await promotionApi.addOneV(newVoucherFormData);
                //console.log("create voucher:", res.isSuccess);
              } catch (error) {
                message.error("Có lỗi xảy ra, vui lòng thử lại");
              }
            }
          } else {
            /**
             * bảng giá đang áp dụng
             * - update hàng loạt
             */
            let groupVoucher = formState.id;

            // tạo mới những voucher có trong list
            let newVoucherFormData = {
              title: formState.title,
              description: formState.description,
              endDate: formState.endDate,
              state: formState.state,
            };
            //console.log(groupVoucher);

            try {
              res = await promotionApi.updateByGroup(
                groupVoucher,
                newVoucherFormData
              );
              //console.log("update voucher:", res.isSuccess);
            } catch (error) {
              message.error("Có lỗi xảy ra, vui lòng thử lại");
            }
          }

          dispatch(
            setOpen({
              name: "PromotionLineModal",
              modalState: {
                visible: false,
              },
            })
          );
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
    } else {
      message.error("Thông tin chưa hợp lệ, vui lòng kiểm tra lại!");
    }

    if (hideLoading) {
      hideLoading();
    }
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

        if (!PP.minQuantity) {
          _errMess.PP.minQuantity = "Không được bỏ trống";
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

        if (type == "create") {
          let res = await promotionApi.getOnePPById(formState.id);
          if (res.isSuccess) {
            _errMess.id = "Mã đã được sử dụng trước đó!";
          }
        }
      }

      // check for MP
      let { MP } = formState;
      if (MP && formState.typePromotionId == "MP") {
        if (!MP.budget || MP.budget <= 0) {
          _errMess.MP.budget = "Giá trị phải > 0";
        }

        if (!MP.minCost) {
          _errMess.MP.minCost = "Không được bỏ trống!";
        }

        if (MP.type == "discountMoney") {
          if (MP.discountMoney <= 0) {
            _errMess.MP.discountMoney = "Số tiền phải > 0!";
          }
        }

        if (MP.type == "discountRate") {
          if (MP.discountRate <= 0 || MP.discountRate > 100) {
            _errMess.MP.discountRate = "Giá trị phải > 0 và <= 100!";
          }
          if (!MP.maxMoneyDiscount && MP.maxMoneyDiscount <= 0) {
            _errMess.MP.maxMoneyDiscount = "Giá trị phải >= 0";
          }
        }

        if (type == "create") {
          let res = await promotionApi.getOneMPById(formState.id);
          if (res.isSuccess) {
            _errMess.id = "Mã đã được sử dụng trước đó!";
          }
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

        if (type == "create") {
          let res = await promotionApi.getOneDRPById(formState.id);
          if (res.isSuccess) {
            _errMess.id = "Mã đã được sử dụng trước đó!";
          }
        }
      }

      // check for V

      let _lvErrMess = {};

      for (const voucherItem of listVoucherCreate) {
        if (!voucherItem.isLastRow) {
          _lvErrMess[voucherItem.id] = {};
        }
      }

      _lvErrMess = {
        ..._lvErrMess,
        ...lvErrMessage,
      };
      //console.log(_lvErrMess);
      let { V } = formState;
      if (V && formState.typePromotionId == "V") {
        //check list voucher
        if (type == "create") {
          if (listVoucherCreate.length == 1) {
            message.error("Vui lòng thêm các dòng trước!");
            isCheck = false;
          } else {
            let groupVoucher = formState.id;

            let res = await promotionApi.getAllByGroup(groupVoucher);
            if (res.isSuccess && res.vouches && res.vouches.length > 0) {
              _errMess.id = "Mã đã được sử dụng trước đó!";
            }
          }
        }
        for (const voucher of listVoucherCreate) {
          if (voucher.isLastRow) continue;
          if (!voucher.code) {
            _lvErrMess[voucher.id].code = "Không được bỏ trống!";
          } else {
            // check in db

            if (!voucher.isExistInDB) {
              try {
                res = await promotionApi.getOneVByCode(voucher.code);
              } catch (err) {}

              if (res.isSuccess) {
                if (type == "create") {
                  _lvErrMess[voucher.id].code =
                    "Code này đã được sử dụng trước đó!";
                }
              }
            }
          }
          if (voucher.type == "discountMoney" && !voucher.discountMoney) {
            _lvErrMess[voucher.id].discountMoney =
              "Số tiền chiết khấu phải > 0!";
          }
          if (voucher.type == "discountRate" && !voucher.discountRate) {
            _lvErrMess[voucher.id].discountRate =
              "Số % chiết khấu phải > 0 và <=100";
            if (voucher.maxDiscountMoney <= 0) {
              _lvErrMess[voucher.id].maxDiscountMoney = "Giá trị phải > 0!";
            }
          }
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

      Object.keys(_lvErrMess).map((key) => {
        if (_lvErrMess[key]) {
          let key2s = Object.keys(_lvErrMess[key]);
          key2s.map((key2) => {
            if (_lvErrMess[key][key2]) {
              isCheck = false;
            }
          });
        }
      });

      setErrMessage(_errMess);
      setLvErrMessage(_lvErrMess);
      //console.log(isCheck);
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

  function disabledDate() {
    if (minMaxTime) {
      //console.log(minMaxTime);
      let min = new Date(minMaxTime.min);
      let max = new Date(minMaxTime.max);
      let now = new Date();
      if (compareDMY(max, now) < 0) {
        return [true, true];
      }
      if (
        modalState.type == "update" &&
        formState.startDate &&
        formState.endDate
      ) {
        let start = new Date(formState.startDate);
        let end = new Date(formState.endDate);
        if (compareDMY(start, now) <= 0) {
          if (compareDMY(end, now) < 0) {
            return [true, true];
          } else {
            return [true, false];
          }
        }
      }
    }
    return [false, false];
  }

  function closeModal() {
    clearModal();
    setModalState({
      visible: false,
    });
  }

  function clearModal() {
    setErrMessage(initErrMessage);

    setFormState(initFormState);
    loadMinMaxTime();
  }

  function setModalState(state) {
    dispatch(
      setOpen({
        name: "PromotionLineModal",
        modalState: state,
      })
    );
  }

  function disabledInput(name) {
    //console.log(modalState.type);
    if (
      modalState.type == "update" &&
      formState.startDate &&
      formState.endDate
    ) {
      let start = new Date(formState.startDate);
      let end = new Date(formState.endDate);
      let now = new Date();

      //đã hết hạn
      if (compareDMY(end, now) < 0) {
        return true;
      }

      if (name == "endDate") {
        return false;
      }
      if (name == "typePromotionId") {
        return true;
      }

      if (name == "id") {
        return true;
      }

      // đang sử dụng
      if (compareDMY(start, now) <= 0) {
        if (name == "state") return false;
        if (name == "title") return false;
        if (name == "description") return false;

        return true;
      }

      // sắp tới sử dụng
      return false;
    }

    if (modalState.type == "view" || modalState.type == "view-one-voucher") {
      return true;
    }
  }

  useEffect(() => {
    if (modalState.type == "create") {
      initFormState.id = uid();
      setFormState(initFormState);

      setListVoucherCreate([
        {
          isLastRow: true,
        },
      ]);
    }

    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, [modalState]);

  return (
    <div className="promotion_line_modal">
      <ModalCustomer
        visible={modalState.visible}
        style={{
          width: "80%",
        }}
        closeModal={() => {
          dispatch(
            setOpen({
              name: "PromotionLineModal",
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
              {modalState.type == "update" &&
                "Cập nhật thông tin một dòng khuyến mãi"}
              {modalState.type == "view" && "Xem thông tin chi tiết khuyến mãi"}
              {modalState.type == "create" && "Thêm mới một dòng khuyến mãi"}
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="promotion_line_form">
              <div className="promotion_line_form_top">
                <div className="promotion_line_form_left">
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
                        disabled={disabledInput("typePromotionId")}
                      />
                      <div className="promotion_line_form_input_err">
                        {errMessage.typePromotionId}
                      </div>
                    </div>
                  </div>

                  <div className="promotion_line_form_group">
                    <div className="promotion_line_form_label">Mã KM</div>
                    <div className="promotion_line_form_input_wrap">
                      <Input
                        className="promotion_line_form_input"
                        size="small"
                        disabled={disabledInput("id")}
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
                    <div className="promotion_line_form_label">Thời gian</div>
                    <div className="promotion_line_form_input_wrap">
                      <DatePickerCustom
                        className="promotion_line_form_input"
                        size="small"
                        value={[formState.startDate, formState.endDate]}
                        status={errMessage.time && "error"}
                        disabled={[
                          disabledInput("startDate"),
                          disabledInput("endDate"),
                        ]}
                        onChangeDate={(strings) => {
                          if (strings) {
                            setFormState({
                              ...formState,
                              startDate: strings[0],
                              endDate: strings[1],
                            });
                          }
                        }}
                        disabledDate={(val) => {
                          if (minMaxTime) {
                            let min = new Date(minMaxTime.min);
                            let max = new Date(minMaxTime.max);
                            let value = new Date(antdToYmd(val));
                            let now = new Date();

                            return (
                              compareDMY(value, now) <= 0 ||
                              compareDMY(value, min) < 0 ||
                              compareDMY(value, max) > 0
                            );
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
                        disabled={disabledInput("title")}
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
                        disabled={disabledInput("description")}
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
                        disabled={disabledInput("state")}
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
                      disabledInput={disabledInput}
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
                      disabledInput={disabledInput}
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
                      disabledInput={disabledInput}
                    />
                  )}
                  {formState.typePromotionId == "V" && (
                    <>
                      {modalState.type == "view-one-voucher" ? (
                        <VoucherPromotionDetail
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
                          disabledInput={disabledInput}
                        />
                      ) : (
                        <VoucherPromotion
                          setLvErrMessage={setLvErrMessage}
                          lvErrMessage={lvErrMessage}
                          tableData={listVoucherCreate}
                          setTableData={setListVoucherCreate}
                          modalState={modalState}
                        />
                      )}
                    </>
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
              {modalState.type == "create" && (
                <>
                  <Button
                    type="primary"
                    onClick={() => {
                      onSubmit("create", true);
                    }}
                  >
                    Lưu
                  </Button>
                </>
              )}
              {modalState.type == "update" && (
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
                Đóng
              </Button>
            </Space>
          </div>
        </div>
      </ModalCustomer>
    </div>
  );
};

export default PromotionLineModal;
