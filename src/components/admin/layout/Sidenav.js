import {
  AppstoreOutlined,
  PieChartOutlined,
  ApartmentOutlined,
  DollarCircleOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { Button, Menu, message } from "antd";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import logoImage from "../../../assets/images/logo.png";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const Sidenav = ({ isAdmin }) => {
  let items = [];
  if (isAdmin) {
    items = [
      getItem("Giao dịch", "sub2", <FileDoneOutlined />, [
        getItem(<NavLink to="orders">Đơn đặt hàng</NavLink>, "orders"),
        getItem(
          <NavLink to="create_bill">Cửa sổ bán hàng</NavLink>,
          "create_bill"
        ),
        getItem(<NavLink to="bills">Hóa đơn</NavLink>, "bills"),
        getItem(<NavLink to="bills_receive">Trả hàng</NavLink>, "returns"),
      ]),
      getItem("Kho", "store", <FileDoneOutlined />, [
        getItem(
          <NavLink to="store_change">Biến động kho</NavLink>,
          "store_change"
        ),
        getItem(<NavLink to="store_check">Kiểm kê kho</NavLink>, "store_cal"),
        getItem(
          <NavLink to="store_tickets">Phiếu nhập kho</NavLink>,
          "store_tiket"
        ),
      ]),

      getItem("Thống kê", "statistic", <FileDoneOutlined />, [
        getItem(
          <NavLink to="statistic/bills-customers">Bán hàng theo KH</NavLink>,
          "banhangtheokh"
        ),
        getItem(
          <NavLink to="statistic/bills-days">Bán hàng theo ngày</NavLink>,
          "banhangtheongay"
        ),
        getItem(
          <NavLink to="statistic/retrieves">Trả hàng</NavLink>,
          "trahang"
        ),
        getItem(
          <NavLink to="statistic/promotions">Tổng kết KM</NavLink>,
          "khuyenmai"
        ),
        getItem(<NavLink to="statistic/inputs">Nhập hàng</NavLink>, "nhaphang"),
        getItem(<NavLink to="statistic/storage">Tồn kho</NavLink>, "tonkho"),
      ]),
      getItem(
        <NavLink to="prices">Bảng giá</NavLink>,
        "price",
        <DollarCircleOutlined />
      ),
      getItem(
        <NavLink to="promotion">Khuyến mãi</NavLink>,
        "promotion",
        <FileDoneOutlined />
      ),
      getItem("Sản phẩm", "sub1", <AppstoreOutlined />, [
        getItem(<NavLink to="products">Danh sách SP</NavLink>, "products"),
        getItem(<NavLink to="category">Nhóm SP</NavLink>, "category"),
        getItem(<NavLink to="unitType">Đơn vị tính</NavLink>, "unitTypes"),
      ]),
      getItem("Khách hàng", "customer", <FileDoneOutlined />, [
        getItem(<NavLink to="customers">Danh sách</NavLink>, "list_customer"),
        getItem(
          <NavLink to="customer_group">Nhóm khách hàng</NavLink>,
          "cus_group"
        ),
      ]),
      getItem(
        <NavLink to="employee">Nhân viên</NavLink>,
        "employee",
        <FileDoneOutlined />
      ),
    ];
  } else {
    items = [
      getItem("Giao dịch", "sub2", <FileDoneOutlined />, [
        getItem(<NavLink to="orders">Đơn đặt hàng</NavLink>, "orders"),
        getItem(
          <NavLink to="create_bill">Cửa sổ bán hàng</NavLink>,
          "create_bill"
        ),
        getItem(<NavLink to="bills">Hóa đơn</NavLink>, "bills"),
        getItem(<NavLink to="bills_receive">Trả hàng</NavLink>, "returns"),
      ]),

      getItem(
        <NavLink to="prices">Bảng giá</NavLink>,
        "price",
        <DollarCircleOutlined />
      ),
      getItem(
        <NavLink to="promotion">Khuyến mãi</NavLink>,
        "promotion",
        <FileDoneOutlined />
      ),
      getItem("Sản phẩm", "sub1", <AppstoreOutlined />, [
        getItem(<NavLink to="products">Danh sách SP</NavLink>, "products"),
        getItem(<NavLink to="category">Nhóm SP</NavLink>, "category"),
        getItem(<NavLink to="unitType">Đơn vị tính</NavLink>, "unitTypes"),
      ]),
      getItem("Khách hàng", "customer", <FileDoneOutlined />, [
        getItem(<NavLink to="customers">Danh sách</NavLink>, "list_customer"),
        getItem(
          <NavLink to="customer_group">Nhóm khách hàng</NavLink>,
          "cus_group"
        ),
      ]),
    ];
  }

  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      style={{
        position: "fixed",
        width: "200px",
        overflowY: "auto",
        height: "90vh",
      }}
      className="sidenav"
    >
      <Menu
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        style={{
          height: "90%",
        }}
        onSelect={(item) => {
          //console.log(item);
        }}
      />
    </div>
  );
};

export default Sidenav;
