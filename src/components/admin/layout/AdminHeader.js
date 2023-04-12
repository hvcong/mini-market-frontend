import React from "react";
import { Layout, Row, Typography } from "antd";
import { Col } from "antd";
import { Breadcrumb } from "antd";
import logoImage from "../../../assets/images/logo.png";
import avatarImg from "../../../assets/images/avatar__default.png";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setOpen } from "../../../store/slices/modalSlice";

const AdminHeader = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.user.account);
  return (
    <Layout
      className="header"
      style={{
        position: "fixed",
        width: "100%",
        zIndex: 10,
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
          <div className="hello_group">
            <div className="hellow_text">Xin chào</div>
            <div className="name">Hoang van cong</div>
          </div>
          <div className="right__item">
            <div className="account">
              <div className="account__avatar">
                <img className="account__img" src={avatarImg} />
              </div>
              <div className="account__drop">
                <div className="drop__item">
                  <UserOutlined />
                  <span
                    className="item__label"
                    onClick={() => {
                      dispatch(
                        setOpen({
                          name: "ProfileModal",
                          modalState: {
                            visible: true,
                            type: "view",
                            idSelected: account.id,
                          },
                        })
                      );
                    }}
                  >
                    Tài khoản
                  </span>
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
