import React from "react";
import { Layout, Row } from "antd";
import { Col } from "antd";
import { Breadcrumb } from "antd";

const AdminHeader = () => {
  return (
    <Layout className="header">
      <Row>
        <Col span={24} md={12}>
          <Breadcrumb>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="">Products</a>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
    </Layout>
  );
};

export default AdminHeader;
