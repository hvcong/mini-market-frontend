import React, { Component, useState } from "react";
import "../../assets/styles/auth.scss";
import logo from "../../assets/images/logo.png";
import { Button, Checkbox, Form, Input, Typography, message } from "antd";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";
import userApi from "./../../api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { employeeLoginOke } from "../../store/slices/userSlice";
import { Navigate, useNavigate } from "react-router-dom";

const Auth = function () {
  const { isLogged } = useSelector((state) => state.user);
  const navigate = useNavigate();
  console.log(isLogged);

  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  if (isLogged) {
    return <Navigate to="/admin/products" replace={true} />;
  }

  async function onSubmit() {
    message.loading("Đang đăng nhập...");
    let res = await userApi.logIn({
      phonenumber: username,
      password: password,
    });

    if (res.isSuccess) {
      message.info("Đăng nhập thành công");
      console.log(res);
      if (res.account.Employee) {
        setTimeout(() => {
          dispatch(
            employeeLoginOke({
              ...res.account.Employee,
            })
          );
        }, 1000);
      }
    }
  }
  return (
    <div className="auth">
      <div className="container" id="container">
        <div className="form-container sign-in-container">
          <form action="#">
            <h2>ĐĂNG NHẬP</h2>
            <div className="social-container">
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
            <span>hoặc sử dụng tài khoản</span>
            <Input
              className="auth_input"
              value={username}
              onChange={({ target }) => {
                setUsername(target.value);
              }}
              placeholder="Email / Số điện thoại"
            />
            <Input
              className="auth_input"
              value={password}
              onChange={({ target }) => {
                setPassword(target.value);
              }}
              placeholder="Mật khẩu"
            />
            <Typography.Link>Quên mật khẩu?</Typography.Link>
            <Button type="primary" className="button" onClick={onSubmit}>
              Đăng Nhập
            </Button>
          </form>
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
