import { Spin } from "antd";
import React from "react";

const ModalCustomer = ({ children, visible, setVisible, isLoading, style }) => {
  return (
    <div
      className="modal"
      style={{
        display: visible ? "flex" : "none",
      }}
    >
      <div className="wrap">
        <div className="content" style={style}>
          {children}
        </div>
        <div className={`loading_container ${isLoading && "active"}`}>
          <Spin size="large" />
        </div>
      </div>
    </div>
  );
};

export default ModalCustomer;
