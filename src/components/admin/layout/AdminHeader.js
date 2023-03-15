import React from "react";
import { Layout, Row, Typography } from "antd";
import { Col } from "antd";
import { Breadcrumb } from "antd";
import logoImage from "../../../assets/images/logo.png";
import avatarImg from "../../../assets/images/avatar__default.png";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";

const AdminHeader = () => {
  return (
    <Layout
      className="header"
      style={{
        position: "fixed",
        width: "100%",
        zIndex: 100,
      }}
    >
      <div className="list">
        <div className="left">
          <div className="logo__container">
            <img className="logo__img" src={logoImage} />
            <span className="brand__name">ECO MARKET</span>
          </div>
        </div>
        <div className="right">
          <div className="right__item">
            <div className="account">
              <div className="account__avatar">
                <img className="account__img" src={avatarImg} />
              </div>
              <Typography.Title level={5} className="name">
                Hoang van cong
              </Typography.Title>

              <div className="account__drop">
                <div className="drop__item">
                  <UserOutlined />
                  <span className="item__label">Tài khoản</span>
                </div>
                <div className="drop__item">
                  <LogoutOutlined />
                  <span className="item__label">Đăng xuất</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHeader;
