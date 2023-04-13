import { Button, Input, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import addressApi from "../../api/addressApi";
import { isVietnamesePhoneNumberValid } from "../../utils";
import userApi from "../../api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { setOpen, setRefreshModal } from "../../store/slices/modalSlice";
import { setRefreshUser } from "../../store/slices/userSlice";

const initFormState = {
  name: "",
  phonenumber: "",
  email: "",
  homeId: "",
  wardId: "",
  districtId: "",
  cityId: "",
  homeName: "",
  wardName: "",
  districtName: "",
  cityName: "",
};

const initErrMessage = {
  name: "",
  phonenumber: "",
  home: "",
  wardId: "",
  districtId: "",
  cityId: "",
  email: "",
  homeName: "",
  wardName: "",
  districtName: "",
  cityName: "",
};

const ProfileInfor = ({ employee }) => {
  let hideLoading = null;
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const modalState = useSelector((state) => state.modal.modals["ProfileModal"]);

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);

  useEffect(() => {
    console.log("refresh");
    if (employee) {
      let newFormState = {
        name: employee.name,
        phonenumber: employee.phonenumber,
        email: employee.email,
      };

      if (employee.HomeAddress) {
        newFormState = {
          ...newFormState,
          homeId: employee.HomeAddressId,
          wardId: employee.HomeAddress.Ward.id,
          districtId: employee.HomeAddress.Ward.District.id,
          cityId: employee.HomeAddress.Ward.District.City.id,
          homeName: employee.HomeAddress.homeAddress,
          wardName: employee.HomeAddress.Ward.name,
          districtName: employee.HomeAddress.Ward.District.name,
          cityName: employee.HomeAddress.Ward.District.City.name,
        };
      }

      setFormState(newFormState);
    }

    setErrMessage(initErrMessage);
    return () => {};
  }, [employee, isEdit]);

  useEffect(() => {
    loadAllAddressData();
    return () => {};
  }, []);

  useEffect(() => {
    if (isEdit) {
      setIsEdit(false);
    }

    if (modalState.refresh) {
      loadAllAddressData();
      dispatch(
        setOpen({
          name: "ProfileModal",
          modalState: {
            ...modalState,
            refresh: false,
          },
        })
      );
    }

    return () => {};
  }, [modalState]);

  async function loadAllAddressData() {
    // load cities
    let res = await addressApi.getAllCity();
    if (res.isSuccess) {
      setCities(res.cities);
    } else {
      message.error("Đường truyền không ổn định, vui lòng thử lại!");
    }

    // load districts
    res = await addressApi.getAllDistrict();
    if (res.isSuccess) {
      setDistricts(res.districts);
    } else {
      message.error("Đường truyền không ổn định, vui lòng thử lại!");
    }

    // load wards
    res = await addressApi.getAllWard();
    if (res.isSuccess) {
      setWards(res.wards);
    } else {
      message.error("Đường truyền không ổn định, vui lòng thử lại!");
    }
  }

  async function onSubmit() {
    hideLoading = message.loading("Đang cập nhật...", 0);
    let homeId = "";
    if (await checkData()) {
      let formData = {
        name: formState.name.trim(),
        phonenumber: formState.phonenumber,
        HomeAddressId: homeId,
      };

      let res = await userApi.updateOneEmployeeByPhone(
        employee.phonenumber,
        formData
      );
      if (res.isSuccess) {
        message.info("Cập nhật thành công");
        setIsEdit(false);
        dispatch(setRefreshUser());
        dispatch(setRefreshModal("ProfileModal"));
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }

    hideLoading();
    async function checkData() {
      const { name, phonenumber, email, wardId, districtId, cityId, homeName } =
        formState;
      let _errMess = {
        name: "",
        phonenumber: "",
        email: "",
        wardId: "",
        districtId: "",
        cityId: "",
        homeName: "",
      };

      if (!name || (name && !name.trim())) {
        _errMess.name = "Tên không hợp lệ!";
      }

      if (!phonenumber) {
        _errMess.phonenumber = "Không được bỏ trống!";
      } else {
        let is = isVietnamesePhoneNumberValid(phonenumber);

        if (is) {
          let res = await userApi.getOneEmployeeByPhone(phonenumber);
          if (res.isSuccess) {
            if (res.employee.phonenumber != employee.phonenumber) {
              _errMess.phonenumber =
                "Số điện thoại đã được sử dụng bởi người dùng khác!";
            }
          }
        } else {
          _errMess.phonenumber = "Số điện thoại không hợp lệ!";
        }
      }

      if (!cityId) {
        _errMess.cityId = "Không được bỏ trống!";
      }

      if (!districtId) {
        _errMess.districtId = "Không được bỏ trống!";
      }

      if (!wardId) {
        _errMess.wardId = "Không được bỏ trống!";
      }

      if (!homeName || (homeName && !homeName.trim())) {
        _errMess.homeName = "Không được bỏ trống!";
      } else {
        let res = await addressApi.addHomeAddress({
          homeAddress: homeName.trim(),
          wardId: formState.wardId,
        });
        if (res.isSuccess) {
          homeId = res.home.id;
        } else {
          _errMess.homeName = "Vui lòng thử lại tên khác!";
          message.info("Có lỗi xảy ra, vui lòng thử lại!");
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
  }

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, [modalState]);

  if (!employee) {
    return;
  }

  let address = "";
  if (formState.homeName) {
    address += formState.homeName + ", ";
  }
  if (formState.wardName) {
    address += formState.wardName + ", ";
  }
  if (formState.districtName) {
    address += formState.districtName + ", ";
  }
  if (formState.cityName) {
    address += formState.cityName + ", ";
  }

  return (
    <div className="profile_infor">
      <div className="profile_infor_top">
        <div className="profile_infor_group">
          <div className="profile_infor_label">Họ và tên</div>
          <div className="profile_infor_input_wrap">
            <Input
              className="profile_infor_input"
              disabled={!isEdit}
              value={formState.name}
              onChange={({ target }) => {
                setFormState({
                  ...formState,
                  name: target.value,
                });
              }}
              status={errMessage.name && "error"}
            />
            <div className="profile_infor_input_err">{errMessage.name}</div>
          </div>
        </div>
        <div className="profile_infor_group">
          <div className="profile_infor_label">Số điện thoại</div>
          <div className="profile_infor_input_wrap">
            <Input
              className="profile_infor_input"
              disabled={!isEdit}
              value={formState.phonenumber}
              onChange={({ target }) => {
                setFormState({
                  ...formState,
                  phonenumber: target.value,
                });
              }}
              status={errMessage.phonenumber && "error"}
            />
            <div className="profile_infor_input_err">
              {errMessage.phonenumber}
            </div>
          </div>
        </div>

        {!isEdit ? (
          <div className="profile_infor_group">
            <div className="profile_infor_label">Địa chỉ</div>
            <div className="profile_infor_input_wrap">
              <Input.TextArea
                className="profile_infor_input"
                readOnly
                value={address}
              />
              <div className="profile_infor_input_err"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="profile_infor_group">
              <div className="profile_infor_label">Thành Phố</div>
              <div className="profile_infor_input_wrap">
                <Select
                  className="profile_infor_input"
                  disabled={!isEdit}
                  options={cities.map((item) => {
                    return {
                      value: item.id,
                      label: item.name,
                    };
                  })}
                  value={formState.cityId}
                  onChange={(value) => {
                    if (value) {
                      let cityName = cities.filter(
                        (item) => item.id == value
                      )[0].name;

                      setFormState({
                        ...formState,
                        cityId: value,
                        cityName: cityName,
                        districtId: "",
                        districtName: "",
                        wardId: "",
                        wardName: "",
                      });
                    }
                  }}
                  status={errMessage.cityId && "error"}
                />
                <div className="profile_infor_input_err">
                  {errMessage.cityId}
                </div>
              </div>
            </div>
            <div className="profile_infor_group">
              <div className="profile_infor_label">Quận / Huyện</div>
              <div className="profile_infor_input_wrap">
                <Select
                  className="profile_infor_input"
                  disabled={!isEdit || !formState.cityId}
                  value={formState.districtId}
                  options={districts
                    .filter((item) => item.CityId == formState.cityId)
                    .map((item) => {
                      return {
                        value: item.id,
                        label: item.name,
                      };
                    })}
                  onChange={(value) => {
                    if (value) {
                      let districtName = "";
                      districtName = districts.filter(
                        (item) => item.id == value
                      )[0].name;
                      setFormState({
                        ...formState,
                        districtId: value,
                        wardId: "",
                        wardName: "",
                        districtName: districtName,
                      });
                    }
                  }}
                  status={errMessage.districtId && "error"}
                />
                <div className="profile_infor_input_err">
                  {errMessage.districtId}
                </div>
              </div>
            </div>
            <div className="profile_infor_group">
              <div className="profile_infor_label">Phường / Xã</div>
              <div className="profile_infor_input_wrap">
                <Select
                  className="profile_infor_input"
                  disabled={!isEdit || !formState.districtId}
                  value={formState.wardId}
                  options={wards
                    .filter((item) => item.DistrictId == formState.districtId)
                    .map((item) => {
                      return {
                        value: item.id,
                        label: item.name,
                      };
                    })}
                  onChange={(value) => {
                    if (value) {
                      let wardName = wards.filter((item) => item.id == value)[0]
                        .name;
                      setFormState({
                        ...formState,
                        wardId: value,
                        wardName: wardName,
                      });
                    }
                  }}
                  status={errMessage.wardId && "error"}
                />
                <div className="profile_infor_input_err">
                  {errMessage.wardId}
                </div>
              </div>
            </div>
            <div className="profile_infor_group">
              <div className="profile_infor_label">Số nhà</div>
              <div className="profile_infor_input_wrap">
                <Input
                  className="profile_infor_input"
                  disabled={!isEdit}
                  value={formState.homeName}
                  onChange={({ target }) => {
                    setFormState({
                      ...formState,
                      homeName: target.value,
                    });
                  }}
                  status={errMessage.homeName && "error"}
                />
                <div className="profile_infor_input_err">
                  {errMessage.homeName}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="profile_btns">
        {isEdit ? (
          <>
            <Button type="primary" className="profile_btn" onClick={onSubmit}>
              Lưu
            </Button>
            <Button
              className="profile_btn"
              danger
              onClick={() => {
                setIsEdit(false);
              }}
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileInfor;
