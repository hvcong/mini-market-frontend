import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, message, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import CustomerSelect from "./CustomerSelect";
import EmployeeSelect from "./EmployeeSelect";
import { useDispatch, useSelector } from "react-redux";
import { convertToVND } from "../../../utils/index";
import billApi from "../../../api/billApi";
import {
  addOneProductToActiveTab,
  clearOneTab,
  removeAllProductOnActiveTab,
} from "../../../store/slices/createBillSlice";

const BillInfor = ({ listPromotionLinesOnActive, tableData }) => {
  const { account, isLogged } = useSelector((state) => state.user);
  const { activeKey } = useSelector((state) => state.createBill.tabState);
  const list = useSelector((state) => state.createBill.listState[activeKey]);
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
  }, [list]);

  function calAmountMoney() {
    let subTotal = 0;
    list.map((productLine) => {
      subTotal =
        subTotal + Number(productLine.price) * Number(productLine.quantity);
    });

    let discountOnProduct = 0;
    let discountOnBill = 0;

    let total = subTotal - discountOnBill - discountOnProduct;
    setAmountMoney({
      ...amountMoney,
      subTotal,
      total,
    });
  }

  async function onSubmit() {
    hideLoading = message.loading("Đang tạo bill...", 0);
    let formData = {
      cost: total,
      customerPhonenumber: "0356267136",
      employeeId: account.id,
      priceIds: list.map((p) => p.id),
    };

    if (await checkData()) {
      let res = await billApi.addOne(formData);
      hideLoading();
      if (res.isSuccess) {
        message.info("Tạo mới hóa đơn thành công");
        clearBill();
      } else {
        message.info("Tạo mới hóa đơn thất bại, vui lòng thử lại");
      }
    }

    async function checkData() {
      let isCheck = true;

      return isCheck;
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
            className="select_container"
            style={{
              border: "1px solid #ddd",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            {account.name}
          </div>
          <div className="time_container">10/03/2023</div>
        </div>
      </div>
      <div className="row">
        <div className="label selectLabel">Khách hàng</div>
        <div className="customer">
          <div className="select_container">
            <CustomerSelect />
          </div>
          <div className="add_cus_icon">
            <PlusOutlined className="icon" />
          </div>
        </div>
        {/* <div className="price_mode">
            
        </div> */}
      </div>
      <div className="row">
        <div className="label">Tổng tiền hàng</div>
        <div className="quantitty">{(list && list.length) || 0}</div>
        <div className="value">{convertToVND(subTotal)}</div>
      </div>
      <div className="row">
        <div className="label">Giảm giá trên sp</div>
        <div
          className="value"
          style={{
            color: "green",
          }}
        >
          {convertToVND(discountOnProduct)}
        </div>
      </div>
      <div className="row">
        <div className="label">Giảm giá trên hóa đơn</div>
        <div
          className="value"
          style={{
            color: "green",
          }}
        >
          {convertToVND(discountOnBill)}
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
          disabled={list.length == 0}
        >
          THANH TOÁN (F5)
        </Button>
      </div>
    </div>
  );
};

export default BillInfor;
