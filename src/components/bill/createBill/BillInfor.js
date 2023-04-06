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

const BillInfor = ({ listPromotionLinesOnActive, tableData }) => {
  const { account, isLogged } = useSelector((state) => state.user);
  // sẽ lưu khuyến mãi MP mà bill áp dụng
  const [MPused, setMPused] = useState(null);
  const { activeKey } = useSelector((state) => state.createBill.tabState);
  const { tabItems = [] } = useSelector((state) => state.createBill.tabState);

  let customerPhone = "0";
  let newPhoneInput = "";
  let isShowNewCustomer = false;
  let voucherUsed = null;
  let voucherInput = "";
  tabItems.map((item) => {
    if (item.key == activeKey) {
      customerPhone = item.customerPhone || "0";
      newPhoneInput = item.newPhoneInput;
      isShowNewCustomer = item.isShowNewCustomer;
      voucherInput = item.voucherInput;
      voucherUsed = item.voucherUsed;
    }
  });

  let hideLoading = null;
  const dispatch = useDispatch();
  const [amountMoney, setAmountMoney] = useState({
    subTotal: 0,
    discountOnProduct: 0,
    discountOnBill: 0,
    discountByVoucher: 0,
    total: 0,
    customerTake: 0,
  });

  const {
    subTotal,
    discountOnProduct,
    discountOnBill,
    discountByVoucher,
    total,
    customerTake,
  } = amountMoney;

  useEffect(() => {
    calAmountMoney();
    return () => {};
  }, [tableData, listPromotionLinesOnActive, voucherUsed]);

  useEffect(() => {
    dispatch(setVoucherInput(""));
    dispatch(setVoucherUsed(null));
    return () => {};
  }, [newPhoneInput, customerPhone, isShowNewCustomer]);

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
    let discountOnBill = 0;
    let discountByVoucher = 0;
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

    if (voucherUsed) {
      if (voucherUsed.type == "discountMoney") {
        discountByVoucher = voucherUsed.discountMoney;
      }

      if (voucherUsed.type == "discountRate") {
      }
    }

    // Số tiền cần trả
    let total = subTotal - discountOnBill;
    if (total < discountByVoucher) {
      discountByVoucher = total;
      total = 0;
    } else {
      total = total - discountByVoucher;
    }

    if (total < 0) {
      total = 0;
    }

    setAmountMoney({
      ...amountMoney,
      discountOnProduct,
      discountOnBill,
      discountByVoucher,
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
          priceIds.push({
            id: row.id,
            quantity: row.quantity,
          });
        }
      }
    });

    let phone = "";
    if (isShowNewCustomer && newPhoneInput) {
      phone = newPhoneInput;
    } else {
      phone = customerPhone || "0";
    }

    let formData = {
      cost: total,
      customerPhonenumber: phone,
      EmployeeId: account.id,
      priceIds,
      type: "success",
    };

    if (await checkData()) {
      let res = await billApi.addOne(formData);
      if (res.isSuccess) {
        message.info("Tạo mới hóa đơn thành công");

        let billId = res.bill.id;

        // xử lí kho
        handleAfter.handleStoreTranAfterCreateBill(
          billId,
          tableData,
          MPused,
          voucherUsed
        );

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

  async function handleChangeVoucherInput(input) {
    dispatch(setVoucherInput(input));
    if (input) {
      let res = await promotionApi.getOneVByCode(input);
      if (res.isSuccess) {
        let voucher = res.voucher;

        let start = new Date(voucher.startDate);
        let end = new Date(voucher.endDate);
        let now = new Date();
        let state = voucher.state;
        console.log(listPromotionLinesOnActive);

        if (compareDMY(start, now) <= 0 && compareDMY(end, now) >= 0 && state) {
          // kiểm tra xem khách hàng này có được áp dụng hay không
          listPromotionLinesOnActive.map((promotionLine) => {
            if (promotionLine.promotionType == "V") {
              if (promotionLine.id == voucher.id) {
                dispatch(setVoucherUsed(voucher));
              }
            }
          });
        }
      } else {
        dispatch(setVoucherUsed(null));
      }
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
      <div className="bill_infor_voucher">
        <div className="bill_infor_voucher_top">
          <div className="bill_infor_voucher_top_label">Phiếu giảm giá</div>
          <div className="bill_infor_voucher_input_wrap">
            <Input
              className="bill_infor_voucher_input"
              size="small"
              value={voucherInput}
              onChange={({ target }) => {
                handleChangeVoucherInput(target.value);
              }}
              placeholder="Nhập mã CODE"
            />
          </div>
          <div className="bill_infor_voucher_result">
            {voucherUsed && (
              <CheckCircleOutlined
                className="bill_infor_voucher_result_icon"
                onClick={() => {
                  dispatch(
                    setOpen({
                      name: "PromotionLineModal",
                      modalState: {
                        type: "view",
                        visible: true,
                        idSelected: voucherUsed.id,
                        promotionHeaderId: voucherUsed.PromotionHeaderId,
                      },
                    })
                  );
                }}
              />
            )}

            {!voucherUsed && voucherInput && (
              <CloseCircleOutlined className="bill_infor_voucher_result_icon close_icon" />
            )}
          </div>
          <div className="bill_infor_voucher_top_value">
            -{convertToVND(discountByVoucher)}
          </div>
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
