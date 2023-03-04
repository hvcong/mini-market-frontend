import React, { useState } from "react";
import { Col, Layout, Row } from "antd";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import "../../../assets/styles/admin.scss";
import Sidenav from "./Sidenav";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
const Main = () => {
  const [keysSidenav, setKeysSidenav] = useState({
    product: "product",
    productActive: "productActive",
    productInactive: "productInactive",
    cate: "cate",
    cate1: "cate1",
    cate2: "cate2",
    price: "price",
    priceActive: "priceActive",
    priceInactive: "priceInactive",
    order: "order",
    orderWaiting: "orderWaiting",
    orderDone: "orderDone",
    bill: "bill",
    customer: "customer",
  });

  const [selectedKey, setSelectedKey] = useState({
    key: "productActive",
    subOpen: "product",
  });

  return (
    <Layout className="admin">
      <Row style={{ height: "100vh" }} gutter={16}>
        <Col span={5}>
          <Sidenav
            keysSidenav={keysSidenav}
            setKeysSidenav={setKeysSidenav}
            selectedKey={selectedKey}
            setSelectedKey={setSelectedKey}
          />
        </Col>
        <Col span={19}>
          <AdminHeader />
          <Outlet
          // context={{
          //   keysSidenav,
          //   setKeysSidenav,
          //   selectedKey,
          //   setSelectedKey,
          // }}
          />
          <AdminFooter />
        </Col>
      </Row>
    </Layout>
  );
};

export default Main;
