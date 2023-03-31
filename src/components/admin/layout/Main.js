import React, { useState } from "react";
import { Col, Layout, Row } from "antd";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import "../../../assets/styles/admin.scss";
import "../../../assets/styles/modals.scss";
import Sidenav from "./Sidenav";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import { useSelector } from "react-redux";
import PriceCUModal from "../../price/PriceCUModal";
import UnitTypeCUModal from "../../unittype/UnitTypeCUModal";
import StoreCheckingModal from "../../store/StoreCheckingModal";
import StoreCheckingDetail from "./../../store/StoreCheckingDetail";
import BillCUModal from "../../bill/BillCUModal";
import ResultDetailModal from "./../../promotion/ResultDetailModal";
import PromotionLineModal from "../../promotion/PromotionLineModal";
const Main = () => {
  const modals = useSelector((state) => state.modal.modals);

  return (
    <div className="admin">
      <div className="header__container">
        <AdminHeader />
      </div>
      <div className="main__layout">
        <div className="left">
          <Sidenav />
        </div>
        <div>
          {/* modals */}

          <UnitTypeCUModal />
          <StoreCheckingModal />
          <StoreCheckingDetail />
          <BillCUModal />
          <ResultDetailModal />
          <PromotionLineModal />
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
