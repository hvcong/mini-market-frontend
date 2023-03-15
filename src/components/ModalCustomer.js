import { Spin } from "antd";
import React from "react";

const ModalCustomer = ({ children, visible, setVisible, isLoading }) => {
  return (
    <div
      className="modal"
      style={{
        display: visible ? "flex" : "none",
      }}
    >
      <div className="wrap">
        <div className="content">{children}</div>
        <div className={`loading_container ${isLoading && "active"}`}>
          <Spin size="large" />
        </div>
      </div>
    </div>
  );
};

export default ModalCustomer;
