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
const Sidenav = () => {
  const items = [
    getItem("Sản phẩm", "sub1", <AppstoreOutlined />, [
      getItem(<NavLink to="products">Danh sách</NavLink>, "products"),
      getItem(<NavLink to="category">Nhóm sản phẩm</NavLink>, "category"),
      getItem(<NavLink to="unitType">Đơn vị tính</NavLink>, "unitTypes"),
    ]),
    getItem(
      <NavLink to="prices">Bảng giá</NavLink>,
      "price",
      <DollarCircleOutlined />
    ),
    getItem("Giao dịch", "sub2", <FileDoneOutlined />, [
      getItem(<NavLink to="bills">Hóa đơn</NavLink>, "bills"),
      getItem(<NavLink to="create_bill">Tạo hóa đơn</NavLink>, "create_bill"),
      getItem(<NavLink to="bills_receive">Trả hàng</NavLink>, "returns"),
      getItem(<NavLink to="orders">Đơn đặt hàng</NavLink>, "orders"),
    ]),
    getItem("Kho", "store", <FileDoneOutlined />, [
      getItem(
        <NavLink to="store_change">Biến động kho</NavLink>,
        "store_change"
      ),
      getItem(<NavLink to="store_check">Kiểm kê kho</NavLink>, "store_cal"),
    ]),
    getItem(
      <NavLink to="promotion">Khuyến mãi</NavLink>,
      "promotion",
      <FileDoneOutlined />
    ),
    getItem(
      <NavLink to="">Thống kê</NavLink>,
      "statistic",
      <FileDoneOutlined />
    ),
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

  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      style={{
        height: "100%",
        position: "fixed",
        width: "200px",
        overflowY: "auto",
      }}
      className="sidenav"
    >
      <Menu
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        style={{
          height: "100%",
        }}
        onSelect={(item) => {
          console.log(item);
        }}
      />
    </div>
  );
};

export default Sidenav;
