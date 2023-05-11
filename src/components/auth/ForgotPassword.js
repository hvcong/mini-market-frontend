import { Button, Input, Typography, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import firebase from "../../app/firebase";
import userApi from "../../api/userApi";
import { useDispatch } from "react-redux";
import { employeeLoginOke } from "../../store/slices/userSlice";
import { isVietnamesePhoneNumberValid } from "../../utils";
const ForgotPassword = ({ setIsForgot }) => {
  let hideLoading = null;

  const dispatch = useDispatch();

  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("INPUT_PHONE");
  const [recaptchaResult, setRecaptchaResult] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmCode, setConfirmCode] = useState(null);
  const otpInputRef = useRef(null);
  const [errMessages, setErrMessages] = useState({
    phone: "",
    otp: "",
    captcha: "",
  });

  async function sendPhone() {
    if (!phone) {
      message.error("Số điện thoại không hợp lệ!");
      return;
    }

    if (!isVietnamesePhoneNumberValid(phone)) {
      message.error("Số điện thoại không hợp lệ!");
      return;
    }

    let res = await userApi.getOneEmployeeByPhone(phone);
    if (!res.isSuccess || !res.employee) {
      message.error("Số điện thoại này chưa đăng kí tài khoản!");
      return;
    }

    let recaptcha = new firebase.auth.RecaptchaVerifier("recaptcha");

    firebase
      .auth()
      .signInWithPhoneNumber("+84" + phone.slice(1), recaptcha)
      .then(function (e) {
        setRecaptchaResult(true);
        setStep("INPUT_OTP");
        setConfirmCode(e);
        message.info("Mã OTP đã được gửi đến số điện thoại " + phone, 5);
        otpInputRef.current.focus();
      })
      .catch((err) => {
        // setRecaptchaResult(true);
        // setStep("INPUT_OTP");
        // setConfirmCode(e);
      });
  }

  async function confirmOTP() {
    if (!otp || (otp && otp.length != 6)) {
      message.error("Mã otp chưa hợp lệ!");
    } else {
      let result = null;
      hideLoading = message.loading("Đang kiểm tra...", 0);
      try {
        result = await confirmCode.confirm(otp);
      } catch (err) {
        message.error("Mã otp chưa hợp lệ!");
        result = null;
      }

      if (result) {
        hideLoading();
        let res = await userApi.getOneEmployeeByPhone(phone);
        if (res.isSuccess) {
          hideLoading = message.loading(
            "Thao tác thành công, tiến hành đăng nhập...",
            0
          );
          setTimeout(() => {
            hideLoading();
            console.log(res.employee);
            dispatch(
              employeeLoginOke({
                ...res.employee,
              })
            );
          }, 2000);
        } else {
          message.error("Số điện thoại không hợp lệ!");
        }
      }
    }
    setTimeout(() => {
      hideLoading();
    }, 1000);
  }

  return (
    <>
      <form action="#">
        <div className="auth_input_wrap">
          <Input
            className="auth_input"
            value={phone}
            onChange={({ target }) => {
              setPhone(target.value);
            }}
            placeholder="Số điện thoại"
            status={errMessages.phone && "error"}
          />
          <div className="auth_input_err">{errMessages.phone}</div>
        </div>
        {recaptchaResult && (
          <div className="auth_input_wrap">
            <Input
              className="auth_input"
              value={otp}
              onChange={({ target }) => {
                setOtp(target.value);
              }}
              placeholder="Nhập mã OTP"
              ref={otpInputRef}
              status={errMessages.otp && "error"}
            />
            <div className="auth_input_err">{errMessages.otp}</div>
          </div>
        )}

        <div
          style={{
            opacity: recaptchaResult && 0,
          }}
        >
          <div id="recaptcha"></div>
        </div>
        <Typography.Link
          onClick={() => {
            setIsForgot(false);
          }}
        >
          Đăng nhập bằng mật khẩu
        </Typography.Link>
        {step == "INPUT_PHONE" ? (
          <Button type="primary" className="button" onClick={sendPhone}>
            Gửi OTP
          </Button>
        ) : (
          <Button type="primary" className="button" onClick={confirmOTP}>
            Kiểm tra OTP
          </Button>
        )}
      </form>
    </>
  );
};

export default ForgotPassword;
