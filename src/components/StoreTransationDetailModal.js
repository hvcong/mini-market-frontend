import React from "react";
import ModalCustomer from "./ModalCustomer";

const StoreTransationDetailModal = ({
  visible,
  setVisible,
  idTransactionSelected,
}) => {
  return (
    <ModalCustomer visible={visible} setVisible={setVisible}>
      <div className="transaction__modal">modal</div>;
    </ModalCustomer>
  );
};

export default StoreTransationDetailModal;
