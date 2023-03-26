import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalCustomer from "../ModalCustomer";
import {
  DatePicker,
  Input,
  InputNumber,
  Table,
  TimePicker,
  Typography,
} from "antd";
import { Space } from "antd";
import { Button } from "antd";
import DropSelectColum from "../product/DropSelectColum";
import storeApi from "./../../api/storeApi";
import dayjs from "dayjs";
import { setOpen } from "../../store/slices/modalSlice";
const dateFormat = "YYYY-MM-DD";

const initFormState = {
  id: "",
  createAt: "",
  EmployeeId: "",
  note: "",
};

const StoreCheckingDetail = () => {
  const dispatch = useDispatch();
  const modalState = useSelector(
    (state) => state.modal.modals["StoreCheckingDetail"]
  );
  const [allColumns, setAllColumns] = useState([
    {
      title: "Mã sản phẩm",
      dataIndex: "ProductId",
      render: (ProductId) => {
        return <Typography.Link>{ProductId}</Typography.Link>;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "Product",
      render: (Product) => {
        if (Product) {
          return Product.name;
        }
      },
    },
    {
      title: "SL báo cáo cơ bản",
      dataIndex: "reportQty",
    },
    {
      title: "SL thực tế báo cáo",
      dataIndex: "realQty",
    },
    {
      title: "SL biến động",
      dataIndex: "",
      render: (_, rowData) => {
        return rowData.realQty - rowData.reportQty;
      },
    },
  ]);
  const [dataTable, setDataTable] = useState([]);
  const [formState, setFormState] = useState(initFormState);

  useEffect(() => {
    let { visible, idSelected, type } = modalState;
    if (visible && idSelected && type == "update") {
      loadTicketDetails(idSelected);
    }

    return () => {};
  }, [modalState]);

  async function loadTicketDetails(idTicket) {
    let res = await storeApi.getOneTicketById(idTicket);
    if (res.isSuccess) {
      let ticket = res.ticket || {};
      let ticketDetails = ticket.TicketDetails || [];

      setFormState({
        id: ticket.id,
        createAt: ticket.createAt,
        EmployeeId: ticket.EmployeeId,
        note: ticket.note,
      });

      setDataTable(ticketDetails);
    }
  }

  function setModalState(state) {
    dispatch(
      setOpen({
        name: "StoreCheckingDetail",
        modalState: state,
      })
    );
  }
  async function onSubmit() {}
  return (
    <div className="promotion_header_detail">
      <div className="price__modal">
        <ModalCustomer
          visible={modalState.visible}
          style={{
            width: "90%",
          }}
        >
          <div>
            <div className="title__container">
              <Typography.Title level={4} className="title">
                {modalState.type == "update" ? "Chi tiết phiếu kiểm kho" : ""}
              </Typography.Title>
            </div>
            <div className="form__container">
              <div className="promotion_header_detail_form_top">
                <div className="promotion_header_detail_form_left">
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_label">
                      Mã phiếu kiểm
                    </div>
                    <div className="promotion_header_form_input_wrap">
                      <Input
                        className="promotion_header_form_input_number"
                        size="small"
                        disabled={true}
                        value={formState.id}
                      />
                    </div>
                  </div>
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_label">
                      Mã nhân viên kiểm
                    </div>
                    <div className="promotion_header_form_input_wrap">
                      <Typography.Link
                        className="promotion_header_form_input_number"
                        size="small"
                      >
                        {formState.EmployeeId}
                      </Typography.Link>
                    </div>
                  </div>

                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_label">
                      Thời gian tạo phiếu
                    </div>
                    <div className="promotion_header_form_input_wrap">
                      <DatePicker
                        className="promotion_header_form_input_number"
                        size="small"
                        disabled={true}
                        value={
                          formState.createAt &&
                          dayjs(formState.createAt, dateFormat)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="promotion_header_detail_form_right">
                  <div className="promotion_header_form_group">
                    <div className="promotion_header_form_label">Ghi chú</div>
                    <div className="promotion_header_form_input_wrap">
                      <Input.TextArea
                        className="promotion_header_form_input_number"
                        size="small"
                        style={{
                          height: 120,
                          width: 600,
                        }}
                        value={formState.note}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="promotion_header_detail_form_bottom">
                <div className="table__header">
                  <div className="left">
                    <Typography.Title
                      level={5}
                      style={{
                        margin: 0,
                      }}
                    >
                      Danh sách sản phẩm kiểm kho{" "}
                    </Typography.Title>
                  </div>

                  <div className="btn__item">
                    <DropSelectColum
                      allColumns={allColumns}
                      setAllColumns={setAllColumns}
                    />
                  </div>
                </div>
                <Table
                  columns={allColumns.filter((col) => !col.hidden)}
                  dataSource={dataTable}
                  pagination={false}
                  size="small"
                  scroll={{
                    x: allColumns.filter((item) => !item.hidden).length * 150,
                    y: window.innerHeight * 0.5,
                  }}
                  className="table"
                />
              </div>
              <Space
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    onSubmit("create", true);
                  }}
                >
                  In phiếu
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => setModalState({ visible: false })}
                >
                  Đóng
                </Button>
              </Space>
            </div>
          </div>
        </ModalCustomer>
      </div>
    </div>
  );
};

export default StoreCheckingDetail;
