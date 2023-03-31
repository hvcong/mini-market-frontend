import {
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
import { convertToVND } from "../../../utils/index";
import billApi from "../../../api/billApi";
import { sqlToDDmmYYY } from "./../../../utils/index";
import {
  addOneProductToActiveTab,
  clearOneTab,
  removeAllProductOnActiveTab,
} from "../../../store/slices/createBillSlice";
import storeApi from "../../../api/storeApi";
import promotionApi from "../../../api/promotionApi";

const BillInfor = ({ listPromotionLinesOnActive, tableData }) => {
  const { account, isLogged } = useSelector((state) => state.user);
  // sẽ lưu khuyến mãi MP mà bill áp dụng
  const [MPused, setMPused] = useState(null);
  const { activeKey } = useSelector((state) => state.createBill.tabState);
  const { tabItems = [] } = useSelector((state) => state.createBill.tabState);

  let customerPhone = "0";
  tabItems.map((item) => {
    if (item.key == activeKey) {
      customerPhone = item.customerPhone;
    }
  });

  let hideLoading = null;
  const dispatch = useDispatch();
  const [amountMoney, setAmountMoney] = useState({
    subTotal: 0,
    discountOnProduct: 0,
    discountOnBill: 0,
    total: 0,
    customerTake: 0,
  });

  const { subTotal, discountOnProduct, discountOnBill, total, customerTake } =
    amountMoney;

  useEffect(() => {
    calAmountMoney();
    return () => {};
  }, [tableData, listPromotionLinesOnActive]);

  function calAmountMoney() {
    let subTotal = 0;

    tableData.map((row) => {
      if (!row.isFirstRow) {
        if (row.DRPused) {
          let price = row.price - (row.price * row.DRPused.discountRate) / 100;
          subTotal += price * row.quantity;
        } else {
          subTotal += row.quantity * row.price;
        }
      }
    });
    let discountOnProduct = 0;
    let discountOnBill = 0;
    let MPused = null;

    listPromotionLinesOnActive.map((promotionLine) => {
      if (promotionLine.promotionType == "MP") {
        let minCost = promotionLine.minCost;
        let type = promotionLine.type;
        let discountMoney = promotionLine.discountMoney;
        let discountRate = promotionLine.discountRate;
        let maxMoneyDiscount = promotionLine.maxMoneyDiscount;

        if (minCost <= subTotal) {
          if (type == "discountMoney") {
            // lấy cái giảm giá nhiều nhát
            if (discountMoney > discountOnBill) {
              MPused = promotionLine;
              discountOnBill = discountMoney;
            }
          }
          if (type == "discountRate") {
            let sum = discountRate * subTotal;
            if (sum > maxMoneyDiscount) {
              sum = maxMoneyDiscount;
            }

            // lấy cái giảm giá nhiều nhát
            if (sum > discountOnBill) {
              discountOnBill = sum;
              MPused = promotionLine;
            }
          }
        }
      }
    });

    setMPused(MPused);

    // Số tiền cần trả
    let total = subTotal - discountOnBill - discountOnProduct;

    setAmountMoney({
      ...amountMoney,
      discountOnProduct,
      discountOnBill,
      subTotal,
      total,
    });
  }

  async function onSubmit() {
    hideLoading = message.loading("Đang tạo bill...", 0);
    let priceIds = [];

    tableData.map((row) => {
      if (!row.isFirstRow) {
        if (!row.isPromotion) {
          priceIds.push(row.id);
        }
      }
    });

    let formData = {
      cost: total,
      customerPhonenumber: customerPhone,
      EmployeeId: account.id,
      priceIds,
    };

    if (await checkData()) {
      let res = await billApi.addOne(formData);
      if (res.isSuccess) {
        message.info("Tạo mới hóa đơn thành công");

        let billId = res.bill.id;

        // xử lí kho
        createStoreTranAfterCreateBill(billId);

        // xứ lí khuyến mãi
        handlePromotionResult(billId, tableData);

        clearBill();
      } else {
        message.info("Tạo mới hóa đơn thất bại, vui lòng thử lại");
      }
    }
    hideLoading();

    async function checkData() {
      let isCheck = true;

      return isCheck;
    }
  }

  async function createStoreTranAfterCreateBill(billId) {
    let res = await billApi.getOneBillById(billId);
    let bill = res.bill || {};
    let billDetails = bill.BillDetails || [];
    let employeeId = bill.EmployeeId;

    let storeTrans = [];

    billDetails.map((detailItem) => {
      let quantity = detailItem.quantity;
      let productId = detailItem.Price.ProductUnitType.ProductId;
      let convertionQuantity =
        detailItem.Price.ProductUnitType.UnitType.convertionQuantity;

      storeTrans.push({
        quantity: quantity * convertionQuantity,
        productId: productId,
        type: "Bán hàng",
        employeeId: employeeId,
      });
    });

    // create store
    storeApi.addMany({
      data: storeTrans,
    });
  }

  async function handlePromotionResult(billId, tableData) {
    console.log(tableData);
    tableData.map((row) => {
      /// PP result
      if (row.isPromotion && row.ProductPromotionId) {
        promotionApi.addResult({
          isSuccess: true,
          note: "Được khuyến mãi khi mua hàng",
          BillId: billId,
          ProductPromotionId: row.ProductPromotionId,
        });
      }

      if (row.DRPused) {
        promotionApi.addResult({
          isSuccess: true,
          note: "Được khuyến mãi khi mua hàng",
          BillId: billId,
          DiscountRateProductId: row.DRPused.id,
        });
      }
    });

    if (MPused) {
      promotionApi.addResult({
        isSuccess: true,
        note: "Được khuyến mãi khi mua hàng",
        BillId: billId,
        MoneyPromotionId: MPused.id,
      });
    }
  }

  function clearBill() {
    dispatch(clearOneTab());
  }
  return (
    <div className="bill_infor">
      <div className="row">
        <div className="label selectLabel">Nhân viên</div>
        <div className="employee">
          <div
            style={{
              border: "1px solid #ddd",
              padding: "4px 8px",
              borderRadius: "4px",
              width: 160,
            }}
          >
            {account.name}
          </div>
          <div className="time_container">{sqlToDDmmYYY(new Date())}</div>
        </div>
      </div>
      <div className="row">
        <div className="label selectLabel">Khách hàng</div>
        <CustomerSelect />
      </div>
      <div className="row">
        <div className="label">Tổng tiền hàng</div>
        <div className="value">{convertToVND(subTotal)}</div>
      </div>

      <div className="row">
        <div className="label">Giảm giá trên hóa đơn</div>
        <div
          className="value"
          style={{
            color: "green",
            cursor: "pointer",
          }}
        >
          {
            <GiftOutlined
              style={{
                paddingRight: 8,
                color: "red",
              }}
            />
          }
          -{convertToVND(discountOnBill)}
        </div>
      </div>
      <div className="row">
        <div className="label bold">Khách cần trả</div>
        <div className="value">
          <Typography.Title level={3} type="success">
            {convertToVND(total)}
          </Typography.Title>
        </div>
      </div>
      <div className="line"></div>
      <div className="row">
        <div
          className="label bold"
          style={{
            flex: 1,
          }}
        >
          Tiền khách thanh toán
        </div>
        <div className="value">
          <InputNumber
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            // onChange={onChange}
            step={1000}
            min={0}
            style={{
              fontSize: "17px",
              width: "140px",
            }}
            value={customerTake}
            onChange={(value) => {
              setAmountMoney({
                ...amountMoney,
                customerTake: value,
                total: subTotal - discountOnBill - discountOnProduct,
              });
            }}
          />
        </div>
      </div>

      <div className="row">
        <div className="label">Tiền thừa trả khách</div>
        <div
          className="value"
          style={{
            fontSize: "15px",
          }}
        >
          {convertToVND(customerTake - total)}
        </div>
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
          THANH TOÁN (F5)
        </Button>
      </div>
    </div>
  );
};

export default BillInfor;
