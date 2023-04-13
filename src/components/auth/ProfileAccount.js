import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Input, Select, Switch, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isVietnamesePhoneNumberValid } from "../../utils";
import userApi from "../../api/userApi";
import { setOpen } from "../../store/slices/modalSlice";
import { setRefreshUser } from "../../store/slices/userSlice";

const roles = [
  {
    label: "Nhân viên bán hàng",
    value: "NV",
  },
  {
    label: "Quản lí",
    value: "AD",
  },
];

const initFormState = {
  phonenumber: "",
  newPassword: "",
  confirmNewPassword: "",
  role: "",
};

const initErrMessage = {
  phonenumber: "",
  newPassword: "",
  confirmNewPassword: "",
  role: "",
};

const ProfileAccount = ({ account }) => {
  let hideLoading = null;
  const accountLoged = useSelector((state) => state.user.account);
  const isAdmin = accountLoged.Account.role == "AD";
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal.modals["ProfileModal"]);

  const [isEdit, setIsEdit] = useState(false);
  const [isEditPassword, setIsEditPassword] = useState(false);

  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);

  useEffect(() => {
    if (account) {
      setFormState({
        phonenumber: account.phonenumber,
        newPassword: "",
        confirmNewPassword: "",
        role: account.role,
      });
    }
    setErrMessage(initErrMessage);

    return () => {};
  }, [account, isEdit, isEditPassword]);

  useEffect(() => {
    if (isEdit) {
      setIsEdit(false);
    }
    if (isEditPassword) {
      setIsEditPassword(false);
    }

    return () => {};
  }, [modalState]);

  function disabledInput(name) {
    if (isEdit) {
      if (isAdmin) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  }

  async function onSubmit() {
    hideLoading = message.loading("Đang cập nhập thông tin...", 0);
    if (await checkData()) {
      let res = await userApi.updateAccountByPhone({
        phonenumber: formState.phonenumber,
        password: formState.newPassword,
        role: formState.role,
      });

      hideLoading();
      if (res.isSuccess) {
        setIsEdit(false);
        setIsEditPassword(false);
        message.info("Cập nhật thành công!");

        dispatch(setRefreshUser());
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }

    async function checkData() {
      let _errMess = {
        phonenumber: "",
        newPassword: "",
        confirmNewPassword: "",
        role: "",
      };

      const { phonenumber, newPassword, confirmNewPassword, role } = formState;
      if (isEditPassword) {
        // check khi cập nhật mật khẩu

        if (!newPassword) {
          _errMess.newPassword = "Không được bỏ trống!";
        } else {
          if (newPassword.length < 8) {
            _errMess.newPassword = "Mật khẩu phải ít nhất 8 kí tự!";
          }
          if (newPassword.length >= 30) {
            _errMess.newPassword = "Mật khẩu phải ít hơn 30 kí tự!";
          }
        }

        if (newPassword != confirmNewPassword) {
          _errMess.confirmNewPassword = "Hai mật khẩu phải giống nhau!";
        }
      } else {
        if (!phonenumber) {
          _errMess.phonenumber = "Không được bỏ trống!";
        } else {
          let isPhoneCorrect = isVietnamesePhoneNumberValid(phonenumber);
          if (isPhoneCorrect) {
            let res = await userApi.getOneEmployeeByPhone(phonenumber);

            if (res.isSuccess) {
              if (res.employee.phonenumber != account.phonenumber) {
                _errMess.phonenumber =
                  "Số điện thoại đã được sử dụng bởi người dùng khác!";
              }
            }
          } else {
            _errMess.phonenumber = "Số điện thoại không hợp lệ!";
          }
        }
      }

      let isCheck = true;
      let keys = Object.keys(_errMess);
      keys.map((key) => {
        if (_errMess[key]) {
          isCheck = false;
        }
      });
      setErrMessage(_errMess);
      return isCheck;
    }
    hideLoading();
  }

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, [modalState]);

  if (!account) {
    return;
  }

  return (
    <div className="profile_account">
      <div className="profile_account_top">
        {/* <div className="profile_account_group">
          <div className="profile_account_label">Tình trạng tài khoản</div>

          <div className="profile_account_input_wrap">
            Đang chờ cấp lại mật khẩu
          </div>
        </div> */}
        <div className="profile_account_group">
          <div className="profile_account_label">Số điện thoại</div>

          <div className="profile_account_input_wrap">
            <Input
              className="profile_account_input"
              disabled
              value={formState.phonenumber}
              onChange={({ target }) => {
                let value = target.value && target.value.trim();
                setFormState({
                  ...formState,
                  phonenumber: value,
                });
              }}
              status={errMessage.phonenumber && "error"}
            />
            <div className="profile_account_input_err">
              {errMessage.phonenumber}
            </div>
          </div>
        </div>

        {isEditPassword ? (
          <>
            <div className="profile_account_group">
              <div className="profile_account_label">Mật khẩu mới</div>

              <div className="profile_account_input_wrap">
                <Input.Password
                  className="profile_account_input"
                  placeholder="Mật khẩu mới"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  value={formState.newPassword}
                  onChange={({ target }) => {
                    let value = target.value && target.value.trim();
                    setFormState({
                      ...formState,
                      newPassword: value,
                    });
                  }}
                  status={errMessage.newPassword && "error"}
                />
                <div className="profile_account_input_err">
                  {errMessage.newPassword}
                </div>
              </div>
            </div>
            <div className="profile_account_group">
              <div className="profile_account_label">Nhập lại khẩu mới</div>

              <div className="profile_account_input_wrap">
                <Input.Password
                  className="profile_account_input"
                  placeholder="Nhập lại mật khẩu mới"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  value={formState.confirmNewPassword}
                  onChange={({ target }) => {
                    let value = target.value && target.value.trim();
                    setFormState({
                      ...formState,
                      confirmNewPassword: value,
                    });
                  }}
                  status={errMessage.confirmNewPassword && "error"}
                />
                <div className="profile_account_input_err">
                  {errMessage.confirmNewPassword}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="profile_account_group">
              <div className="profile_account_label">Mật khẩu</div>

              <div className="profile_account_input_wrap">
                <Input
                  className="profile_account_input"
                  value={"day chi la mat khau rac"}
                  type="password"
                  disabled
                />
                <div className="profile_account_input_err"></div>
              </div>
            </div>
          </>
        )}
        <div className="profile_account_group">
          <div className="profile_account_label">Loại tài khoản</div>

          <div className="profile_account_input_wrap">
            <Select
              className="profile_account_input"
              options={roles}
              disabled={disabledInput("role")}
              value={formState.role}
              onChange={(value) => {
                setFormState({
                  ...formState,
                  role: value,
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className="profile_btns">
        {isEdit || isEditPassword ? (
          <>
            <Button type="primary" className="profile_btn" onClick={onSubmit}>
              Cập nhật
            </Button>
            <Button
              className="profile_btn"
              onClick={() => {
                setIsEdit(false);
                setIsEditPassword(false);
              }}
              danger
            >
              Hủy
            </Button>
          </>
        ) : (
          <>
            <Button
              className="profile_btn"
              onClick={() => {
                setIsEdit(true);
              }}
            >
              Chỉnh sửa
            </Button>
            <Button
              className="profile_btn"
              onClick={() => {
                setIsEditPassword(true);
              }}
            >
              Thay đổi mật khẩu
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileAccount;
