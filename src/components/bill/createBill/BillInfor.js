import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  GiftFilled,
  GiftOutlined,
  GiftTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Input, InputNumber, message, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import CustomerSelect from "./CustomerSelect";
import EmployeeSelect from "./EmployeeSelect";
import { useDispatch, useSelector } from "react-redux";
import { compareDMY, convertToVND, handleAfter } from "../../../utils/index";
import billApi from "../../../api/billApi";
import { sqlToDDmmYYY } from "./../../../utils/index";
import {
  clearOneTab,
  setVoucherInput,
  setVoucherUsed,
} from "../../../store/slices/createBillSlice";
import storeApi from "../../../api/storeApi";
import promotionApi from "../../../api/promotionApi";
import { setOpen } from "../../../store/slices/modalSlice";
import VoucherEnter from "./VoucherEnter";
import BillInforTop from "./BillInforTop";
import BillInforTotal from "./BillInforTotal";
import BillPrint from "../BillPrint";
import productApi from "../../../api/productApi";
import { useGlobalContext } from "../../../store/GlobalContext";

const BillInfor = ({
  listPromotionLinesOnActive,
  tableData,
  customer,
  costBeforeDiscountVoucher,
  discountMoneyByMoneyPromotion,
  MPused,
}) => {
  const { account, isLogged } = useSelector((state) => state.user);
  // sẽ lưu khuyến mãi MP mà bill áp dụng
  const { activeKey } = useSelector((state) => state.createBill.tabState);
  const { tabItems = [] } = useSelector((state) => state.createBill.tabState);
  const { emitUpdateOrder } = useGlobalContext();

  let voucherUsed = null;
  tabItems.map((item) => {
    if (item.key == activeKey) {
      voucherUsed = item.voucherUsed;
    }
  });

  let hideLoading = null;
  const dispatch = useDispatch();
  const [amountMoney, setAmountMoney] = useState({
    subTotal: 0,
    discountOnBill: 0,
    discountByVoucher: 0,
    total: 0,
    customerTake: 0,
  });

  useEffect(() => {
    calAmountMoney();
    return () => {};
  }, [
    tableData,
    listPromotionLinesOnActive,
    voucherUsed,
    customer,
    costBeforeDiscountVoucher,
    discountMoneyByMoneyPromotion,
  ]);

  function calAmountMoney() {
    let discountByVoucher = 0;
    let total = 0;

    // tính discountByVoucher
    if (voucherUsed) {
      if (voucherUsed.type == "discountMoney") {
        discountByVoucher = voucherUsed.discountMoney;
      }

      if (voucherUsed.type == "discountRate") {
        let maxDiscountMoney = voucherUsed.maxDiscountMoney;

        let discount = 0;

        discount = (voucherUsed.discountRate / 100) * costBeforeDiscountVoucher;
        if (discount <= maxDiscountMoney) {
          discountByVoucher = discount;
        } else {
          discountByVoucher = maxDiscountMoney;
        }
      }
    }

    if (costBeforeDiscountVoucher < discountByVoucher) {
      discountByVoucher = costBeforeDiscountVoucher;
    }

    total = costBeforeDiscountVoucher - discountByVoucher;

    setAmountMoney({
      ...amountMoney,
      discountByVoucher,
      subTotal: costBeforeDiscountVoucher,
      total,
    });
  }

  async function onSubmit() {
    hideLoading = message.loading("Đang tiến hành thanh toán ...", 0);
    let priceIds = [];

    for (const row of tableData) {
      if (!row.isRowNotData) {
        if (!row.isPromotion) {
          priceIds.push({
            id: row.id,
            quantity: row.quantity,
          });
        }
      }
    }

    let formData = {
      cost: amountMoney.total,
      customerPhonenumber: customer.phonenumber || "0",
      EmployeeId: account.id,
      priceIds,
      type: "success",
    };

    if (await checkData()) {
      let res = await billApi.addOne(formData);
      if (res.isSuccess) {
        message.info("Thanh toán thành công");

        let billId = res.bill.id;

        // xử lí kho
        await handleAfter.handleStoreTranAfterCreateBill(
          billId,
          tableData,
          MPused,
          voucherUsed,
          discountMoneyByMoneyPromotion,
          amountMoney.discountByVoucher
        );
        emitUpdateOrder();
        dispatch(
          setOpen({
            name: "BillPrintModal",
            modalState: {
              visible: true,
              idSelected: res.bill.id,
              type: "view",
            },
          })
        );

        clearBill();
      } else {
        message.info("Thanh toán thành công thất bại, vui lòng thử lại");
      }
    }
    hideLoading();
    async function checkData() {
      let isCheck = true;

      const _quantitys = {};

      for (const rowData of tableData) {
        if (rowData.isRowNotData) {
          continue;
        }

        if (rowData.ProductUnitType) {
          let productId = rowData.ProductUnitType.ProductId;
          let convertionQuantity =
            rowData.ProductUnitType.UnitType.convertionQuantity;
          let quantity = rowData.quantity;

          if (!_quantitys[productId]) {
            _quantitys[productId] = 0;
          }
          _quantitys[productId] += quantity * convertionQuantity;
        }
      }

      const isEnoughProducts = {};
      let productIds = Object.keys(_quantitys);
      let isEnough = true;

      for (const productId of productIds) {
        let quantityChange = -_quantitys[productId];
        let res = await productApi.updateQuantity(productId, quantityChange);
        if (res.isSuccess) {
          isEnoughProducts[productId] = true;
        } else {
          isEnough = false;
        }
      }

      // không đủ cập nhật lại toàn bộ
      if (!isEnough) {
        for (const productId of productIds) {
          if (isEnoughProducts[productId]) {
            let quantityChange = _quantitys[productId];
            await productApi.updateQuantity(productId, quantityChange);
          }
        }
        isCheck = false;
        message.error(
          "Không đủ số lượng, vui lòng tải lại trình duyệt để cập nhật số lượng mới nhất!"
        );
      }

      return isCheck;
    }
  }

  function clearBill() {
    setVoucherUsed(null);
    dispatch(clearOneTab());
  }
  return (
    <div className="bill_infor">
      <div className="bill_infor_item">
        <BillInforTop />
      </div>

      <div className="bill_infor_item">
        <VoucherEnter
          voucherUsed={voucherUsed}
          customer={customer}
          discountByVoucher={amountMoney.discountByVoucher}
        />
      </div>
      <div className="bill_infor_item">
        <BillInforTotal amountMoney={amountMoney} />
      </div>
      <div className="btn">
        <Button
          type="primary"
          size="large"
          style={{
            width: "100%",
          }}
          onClick={onSubmit}
          disabled={tableData.length <= 1}
        >
          THANH TOÁN
        </Button>
      </div>
      <BillPrint />
    </div>
  );
};

export default BillInfor;
