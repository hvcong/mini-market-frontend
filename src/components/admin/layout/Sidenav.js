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
const Sidenav = ({
  keysSidenav,
  setKeysSidenav,
  selectedKey,
  setSelectedKey,
}) => {
  const {
    product,
    productActive,
    productInactive,
    cate,
    cate1,
    cate2,
    price,
    priceActive,
    priceInactive,
    order,
    orderWaiting,
    orderDone,
    bill,
    customer,
  } = keysSidenav;

  const items = [
    getItem("Sản phẩm", product, <AppstoreOutlined />, [
      getItem(<NavLink to="products/active">Đang bán</NavLink>, productActive),
      getItem(
        <NavLink to="products/inactive">Đã dừng bán</NavLink>,
        productInactive
      ),
    ]),
    getItem("Danh mục sản phẩm", cate, <AppstoreOutlined />, [
      getItem(<NavLink to="categories1">Danh mục sp cấp 1</NavLink>, cate1),
      getItem(<NavLink to="categories2">Danh mục sp cấp 2</NavLink>, cate2),
    ]),
    getItem("Bảng giá", price, <DollarCircleOutlined />, [
      getItem(<NavLink to="prices">Đang áp dụng</NavLink>, "aa"),
      getItem(<NavLink to="prices">Đã ngưng</NavLink>, "sdfdsf"),
    ]),
    getItem("Đơn đặt hàng online", order, <ApartmentOutlined />, [
      getItem("Đang chờ xử lí", orderWaiting),
      getItem("Hoàn tất", orderDone),
    ]),
    getItem("Hóa đơn bán hàng", bill, <FileDoneOutlined />),
    getItem("Khách hàng", customer, <FileDoneOutlined />),
    getItem("Thống kê", "áddfdsfsd", <FileDoneOutlined />),
  ];

  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      style={{
        height: "100%",
      }}
      className="sidenav"
    >
      <div className="logo">
        <img src={logoImage} className="image" />
      </div>
      <Menu
        defaultSelectedKeys={[selectedKey.key]}
        defaultOpenKeys={[selectedKey.subOpen]}
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
