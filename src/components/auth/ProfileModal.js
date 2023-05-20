import { Button, Input, Space, Tabs, Typography, message } from "antd";
import ModalCustomer from "../ModalCustomer";
import "../../assets/styles/profile.scss";
import ProfileInfor from "./ProfileInfor";
import ProfileAccount from "./ProfileAccount";
import { useDispatch, useSelector } from "react-redux";
import { setOpen } from "../../store/slices/modalSlice";
import { useEffect, useState } from "react";
import userApi from "../../api/userApi";

const ProfileModal = () => {
  const modalState = useSelector((state) => state.modal.modals["ProfileModal"]);
  const { account, refresh } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (modalState.idSelected) {
      loadProfile(modalState.idSelected);
    }
    return () => {};
  }, [modalState, account]);

  useEffect(() => {
    if (modalState.refresh && modalState.idSelected) {
      loadProfile(modalState.idSelected);
    }
    return () => {};
  }, [modalState.refresh]);

  async function loadProfile(employeeId) {
    let res = await userApi.getOneEmployeeById(employeeId);
    if (res.isSuccess) {
      setEmployee(res.employee);

      //console.log(res);
    } else {
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  }

  if (!employee) return;

  return (
    <ModalCustomer
      visible={modalState.visible}
      closeModal={() => {
        dispatch(
          setOpen({
            name: "ProfileModal",
            modalState: {
              visible: false,
            },
          })
        );
      }}
      style={{
        width: "600px",
      }}
    >
      <div className="profile">
        <Typography.Title level={5} className="profile_title">
          {employee.id == account.id
            ? "Thông tin cá nhân"
            : "Xem thông tin nhân viên"}
        </Typography.Title>
        <div className="profile_header"></div>
        <div className="profile_content">
          <Tabs
            tabPosition="left"
            items={[
              {
                key: "1",
                label: "Thông tin chung",
                children: (
                  <>
                    <ProfileInfor employee={employee} />
                  </>
                ),
              },
              {
                key: "2",
                label: "Tài khoản",
                children: (
                  <>
                    <ProfileAccount account={employee.Account} />
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>
    </ModalCustomer>
  );
};
export default ProfileModal;
