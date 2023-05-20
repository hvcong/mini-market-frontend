import React, { useEffect, useState } from "react";
import { Col, Layout, Row } from "antd";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import "../../../assets/styles/admin.scss";
import "../../../assets/styles/modals.scss";
import Sidenav from "./Sidenav";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import { useDispatch, useSelector } from "react-redux";
import PriceCUModal from "../../price/PriceCUModal";
import UnitTypeCUModal from "../../unittype/UnitTypeCUModal";
import StoreCheckingModal from "../../store/StoreCheckingModal";
import BillCUModal from "../../bill/BillCUModal";
import ResultDetailModal from "./../../promotion/ResultDetailModal";
import PromotionLineModal from "../../promotion/PromotionLineModal";
import StoreCUModal from "../../store/StoreCUModal";
import BillPrint from "../../bill/BillPrint";
import ProfileModal from "../../auth/ProfileModal";
import userApi from "../../../api/userApi";
import { employeeLoginOke } from "../../../store/slices/userSlice";
import CustomerCUModal from "../../customer/CustomerCUModal";

const Main = () => {
  const modals = useSelector((state) => state.modal.modals);
  const dispatch = useDispatch();
  const { isLogged, refresh, account, isAdmin } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    //console.log(isLogged, account, refresh);
    if (isLogged && account && refresh) {
      loadAccountLoged(account.id);
    }

    return () => {};
  }, [refresh]);

  async function loadAccountLoged(employeeId) {
    let res = await userApi.getOneEmployeeById(employeeId);
    if (res.isSuccess) {
      dispatch(employeeLoginOke(res.employee));
    }
  }
  if (!isLogged) {
    return <Navigate to="/auth" replace={true} />;
  }

  return (
    <div className="admin">
      <div className="header__container">
        <AdminHeader />
      </div>
      <div className="main__layout">
        <div className="main__layout_left">
          <Sidenav isAdmin={isAdmin} />
        </div>
        <div>
          {/* modals */}

          <UnitTypeCUModal />
          <StoreCheckingModal />
          <BillCUModal />
          <ResultDetailModal />
          <PromotionLineModal />
          <StoreCUModal />
          <BillPrint />
          <ProfileModal />
          <CustomerCUModal />
        </div>

        <div className="right">
          <Outlet />
          {/* <AdminFooter /> */}
        </div>
      </div>
    </div>
  );
};

export default Main;
