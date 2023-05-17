import React, { Component, useEffect, useState } from "react";
import "../../assets/styles/auth.scss";
import logo from "../../assets/images/logo.png";
import { Button, Checkbox, Form, Input, Typography, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  FacebookOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import userApi from "./../../api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { employeeLoginOke } from "../../store/slices/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";

const Auth = function () {
  let hideLoading = null;
  const { isLogged } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isForgot, setIsForgot] = useState(false);
  // useEffect(() => {
  //   onSubmit();
  //   return () => {};
  // }, []);

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, [hideLoading]);
  if (isLogged) {
    return <Navigate to="/admin/products" replace={true} />;
  }

  async function onSubmit() {
    if (hideLoading) {
      hideLoading();
    }
    hideLoading = message.loading("Đang đăng nhập...", 0);
    let res = await userApi.logIn({
      phonenumber: username,
      password: password,
    });

    if (res.isSuccess) {
      if (res.account.Employee) {
        setTimeout(() => {
          hideLoading();
          dispatch(
            employeeLoginOke({
              ...res.account.Employee,
              Account: res.account,
            })
          );
        }, 1000);
      } else {
        message.error("Tài khoản hoặc mật khẩu không chính xác!");
      }
    } else {
      hideLoading();
      message.error("Tài khoản hoặc mật khẩu không chính xác!");
    }
  }
  return (
    <div className="auth">
      <div className="container" id="container">
        <div className="form-container sign-in-container">
          <h2>{isForgot ? "XÁC THỰC OTP" : "ĐĂNG NHẬP"}</h2>
          {isForgot ? (
            <ForgotPassword setIsForgot={setIsForgot} />
          ) : (
            <form action="#">
              {/* <div className="social-container">
                <Typography.Link className="social_item_fb">
                  <FacebookOutlined
                    style={{
                      fontSize: 20,
                      color: "#424ae2",
                    }}
                  />
                </Typography.Link>
                <Typography.Link className="social_item_gg">
                  <GoogleOutlined
                    style={{
                      fontSize: 20,
                      color: "#b7b032",
                    }}
                  />
                </Typography.Link>
              </div>
              <span>hoặc sử dụng tài khoản</span> */}

              <div className="auth_input_wrap">
                <Input
                  className="auth_input"
                  value={username}
                  onChange={({ target }) => {
                    setUsername(target.value);
                  }}
                  placeholder="Số điện thoại"
                />
                <div className="auth_input_err"></div>
              </div>

              <div className="auth_input_wrap">
                <Input.Password
                  className="auth_input"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  value={password}
                  onChange={({ target }) => {
                    setPassword(target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.code == "Enter") {
                      onSubmit();
                    }
                  }}
                  placeholder="Mật khẩu"
                />
                <div className="auth_input_err"></div>
              </div>
              <Typography.Link
                onClick={() => {
                  setIsForgot(true);
                }}
              >
                Quên mật khẩu?
              </Typography.Link>
              <Button type="primary" className="button" onClick={onSubmit}>
                Đăng Nhập
              </Button>
            </form>
          )}
        </div>
        <div className="overlay-container">
          <div className="overlay-panel">
            <img src={logo} className="image_logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
