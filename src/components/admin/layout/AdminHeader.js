import React, { useEffect } from "react";
import { Layout, Row, Typography, message } from "antd";
import { Col } from "antd";
import { Breadcrumb } from "antd";
import logoImage from "../../../assets/images/logo.png";
import avatarImg from "../../../assets/images/avatar__default.png";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setOpen } from "../../../store/slices/modalSlice";
import { logOut } from "../../../store/slices/userSlice";

const AdminHeader = () => {
  let hideLoading = null;
  const dispatch = useDispatch();
  const account = useSelector((state) => state.user.account);

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, []);
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
            <div className="hellow_text">Xin chào </div>
            <div className="name">{account.name}</div>
          </div>
          <div className="right__item">
            <div className="account">
              <div className="account__avatar">
                <img className="account__img" src={avatarImg} />
              </div>
              <div className="account__drop">
                <div
                  className="drop__item"
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
                  <UserOutlined />
                  <span className="item__label">Tài khoản</span>
                </div>
                <div
                  className="drop__item"
                  onClick={() => {
                    hideLoading = message.loading("Đang đăng xuất...", 0);
                    setTimeout(() => {
                      hideLoading();
                      dispatch(logOut());
                    }, 1000);
                  }}
                >
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
