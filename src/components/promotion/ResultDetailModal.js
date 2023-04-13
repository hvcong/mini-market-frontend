import { Button, Space, Typography } from "antd";
import React, { useState } from "react";
import ModalCustomer from "./../ModalCustomer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setOpen } from "../../store/slices/modalSlice";

const ResultDetailModal = () => {
  const dispatch = useDispatch();
  const modalState = useSelector(
    (state) => state.modal.modals["ResultDetailModal"]
  );

  function setModalState(state) {
    dispatch(
      setOpen({
        name: "ResultDetailModal",
        modalState: state,
      })
    );
  }

  return (
    <div className="result_detail_modal">
      <ModalCustomer
        visible={modalState.visible}
        style={{
          width: "380px",
        }}
        closeModal={() => {
          dispatch(
            setOpen({
              name: "ResultDetailModal",
              modalState: {
                visible: false,
              },
            })
          );
        }}
      >
        <div>
          <div className="title__container">
            <Typography.Title level={4} className="title">
              Chi tiết kết quả khuyến mãi
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="result_detail_form"></div>
            <Space
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button
                type="primary"
                danger
                onClick={() => {
                  setModalState({
                    visible: false,
                  });
                }}
              >
                Đóng
              </Button>
            </Space>
          </div>
        </div>
      </ModalCustomer>
    </div>
  );
};

export default ResultDetailModal;
