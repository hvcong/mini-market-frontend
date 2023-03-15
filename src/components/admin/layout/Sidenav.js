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
    ]),
    getItem(
      <NavLink to="prices">Bảng giá</NavLink>,
      "price",
      <DollarCircleOutlined />
    ),
    getItem("Giao dịch", "sub2", <FileDoneOutlined />, [
      getItem(<NavLink to="bills">Hóa đơn</NavLink>, "bills"),
      getItem(<NavLink to="returns">Trả hàng</NavLink>, "returns"),
      getItem(<NavLink to="storage">Nhập kho</NavLink>, "storage"),
    ]),
    getItem(
      <NavLink to="statistic">Thống kê</NavLink>,
      "statistic",
      <FileDoneOutlined />
    ),
    getItem(
      <NavLink to="customers">Khách hàng</NavLink>,
      "customers",
      <FileDoneOutlined />
    ),
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
