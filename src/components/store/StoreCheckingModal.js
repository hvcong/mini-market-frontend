import React, { useEffect, useRef, useState } from "react";

import {
  Modal,
  Button,
  Cascader,
  DatePicker,
  Form,
  Radio,
  Select,
  Switch,
  TreeSelect,
  Input,
  Row,
  Col,
  Typography,
  Space,
  InputNumber,
  Divider,
  Table,
  message,
} from "antd";
import ModalCustomer from "../ModalCustomer";

import DropSelectColum from "../product/DropSelectColum";
import { DeleteOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import ProductIdIInputSearchSelect from "../common/ProductIdIInputSearchSelect";
import { getPUTid, handleAfter, sqlToAntd, uid } from "../../utils";
import productApi from "../../api/productApi";
import unitTypeApi from "./../../api/unitTypeApi";
import { useDispatch, useSelector } from "react-redux";
import storeApi from "./../../api/storeApi";
import UnitTypeSelectByProductId from "../promotion/UnitTypeSelectByProductId";
import { setRefreshStoreTrans } from "../../store/slices/storeTranSlice";
import { setOpen } from "../../store/slices/modalSlice";
import { setRefreshStoreTickets } from "../../store/slices/storeTicketSlice";

const lastItemOfTable = {
  isLastRow: true,
};
const initDataTable = [
  // {
  //   rowId: "",
  //   product: "",
  //   utIdSelected: "",
  // quantity1:"",
  // quantity2:"",

  //   quantity3: 0,
  //   quantity4: 0,
  //    quantity4Disabled:false
  // },

  lastItemOfTable,
];

const initErrMessage = {
  // rowId: {
  //   product: "",
  //   utIdSelected: "",
  //   quantity3: "",
  //   quantity4: "",
  // },
};

const initFormState = {
  id: "",
  createAt: "",
  EmployeeId: "",
  EmployeeName: "",
  note: "",
};

const ddMMyyyy = "DD/MM/YYYY";

const StoreCheckingModal = () => {
  let hideLoading = null;
  const dispatch = useDispatch();
  const modalState =
    useSelector((state) => state.modal.modals["StoreCheckingModal"]) || {};
  const { account } = useSelector((state) => state.user);
  const [allColumns, setAllColumns] = useState([]);
  const [dataTable, setDataTable] = useState(initDataTable);
  const [errMessage, setErrMessage] = useState(initErrMessage);
  const [formState, setFormState] = useState(initFormState);

  useEffect(() => {
    let _allCol = [
      {
        title: "",
        dataIndex: "x",
        width: 40,
        fixed: "left",
        fixedShow: true,
        render: (_, rowData) => {
          if (rowData.isLastRow) {
            if (modalState.type != "view")
              return (
                <Button
                  icon={<PlusOutlined style={{ fontSize: "12px" }} />}
                  type="dashed"
                  onClick={() => {
                    addNewRow();
                  }}
                >
                  Thêm mới một dòng
                </Button>
              );
          } else if (modalState.type == "create") {
            return (
              <Button
                icon={
                  <DeleteOutlined
                    style={{ fontSize: "12px", color: "red" }}
                    onClick={() => {
                      removeRowById(rowData.rowId);
                    }}
                  />
                }
                size="small"
                danger
                disabled={modalState.type == "view"}
              />
            );
          }
        },
      },
      {
        title: "Mã sản phẩm",
        dataIndex: "product",
        render: (_, rowData) => {
          if (!rowData.isLastRow) {
            let productId = rowData.product && rowData.product.id;
            let errText =
              errMessage[rowData.rowId] && errMessage[rowData.rowId].product;
            return (
              <>
                <ProductIdIInputSearchSelect
                  onChange={(productId) => {
                    handleChangeProductIdSelect(productId, rowData.rowId);
                  }}
                  style={{
                    width: "140px",
                  }}
                  size="small"
                  value={productId}
                  disabled={modalState.type == "view"}
                  status={errText && "error"}
                />
                <div className="input_err">{errText}</div>
              </>
            );
          }
        },
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "product",
        render: (_, rowData) => {
          if (!rowData.isLastRow) {
            if (rowData.product) {
              return rowData.product.name;
            }
          }
        },
      },
      {
        title: "ĐV báo cáo",
        dataIndex: "product",

        render: (_, rowData) => {
          if (!rowData.isLastRow) {
            let productId = "";
            if (rowData.product) {
              productId = rowData.product.id;
            }
            let errText =
              errMessage[rowData.rowId] &&
              errMessage[rowData.rowId].utIdSelected;

            return (
              <>
                <UnitTypeSelectByProductId
                  style={{ width: 130 }}
                  size="small"
                  productId={productId}
                  onChange={(utId) => {
                    handleOnChangeUtIdSelect(utId, rowData.rowId);
                  }}
                  value={rowData.utIdSelected}
                  disabled={modalState.type == "view"}
                  status={errText && "error"}
                />
                <div className="input_err">{errText}</div>
              </>
            );
          }
        },
      },
      {
        title: "SL tồn hệ thống (ĐV báo cáo)",
        width: 130,
        dataIndex: "quantity1",
      },
      {
        title: "SL lẻ tồn hệ thống (ĐV cơ bản)",
        width: 130,

        dataIndex: "quantity2",
      },
      {
        title: "SL thực tế (ĐV báo cáo)",
        dataIndex: "product",
        render: (_, rowData) => {
          if (!rowData.isLastRow) {
            return (
              <InputNumber
                size="small"
                disabled={
                  !rowData.product ||
                  !rowData.utIdSelected ||
                  modalState.type == "view"
                }
                min={0}
                value={rowData.quantity3}
                onChange={(value) => {
                  if (value || value == 0) {
                    let _dataTable = dataTable.map((row) => {
                      if (row.rowId == rowData.rowId) {
                        return {
                          ...row,
                          quantity3: value,
                        };
                      }
                      return row;
                    });
                    setDataTable(_dataTable);
                  }
                }}
              />
            );
          }
        },
      },
      {
        title: "SL lẻ thực tế (ĐV cơ bản)",
        dataIndex: "product",
        render: (_, rowData) => {
          if (!rowData.isLastRow) {
            return (
              <InputNumber
                size="small"
                disabled={
                  !rowData.product ||
                  rowData.quantity4Disabled ||
                  !rowData.utIdSelected ||
                  modalState.type == "view"
                }
                min={0}
                value={rowData.quantity4}
                onChange={(value) => {
                  if (value || value == 0) {
                    let _dataTable = dataTable.map((row) => {
                      if (row.rowId == rowData.rowId) {
                        return {
                          ...row,
                          quantity4: value,
                        };
                      }
                      return row;
                    });
                    setDataTable(_dataTable);
                  }
                }}
              />
            );
          }
        },
      },
    ];

    setAllColumns(_allCol);

    return () => {};
  }, [dataTable, modalState, errMessage]);

  function addNewRow() {
    let newRow = {
      rowId: uid(),
      product: "",
      utIdSelected: "",

      quantity3: 0,
      quantity4: 0,
    };

    let _dataTable = [...dataTable];
    _dataTable.splice(_dataTable.length - 1, 0, newRow);
    setDataTable(_dataTable);

    // add message for row
    setErrMessage({
      ...errMessage,
      [newRow.rowId]: {},
    });
  }

  function removeRowById(rowId) {
    let _dataTable = dataTable.filter((row) => row.rowId != rowId);
    setDataTable(_dataTable);
  }

  function closeModal() {
    setModalState({
      visible: false,
    });
    clearModal();
  }

  function setModalState(state) {
    dispatch(
      setOpen({
        name: "StoreCheckingModal",
        modalState: state,
      })
    );
  }

  function clearModal() {
    setDataTable(initDataTable);
    setFormState(initFormState);
  }

  async function handleChangeProductIdSelect(productId, rowId) {
    if (productId) {
      // kiểm tra trùng trong bảng, nếu trùng thì ko cho thêm
      let isExist = false;
      dataTable.map((row) => {
        if (row && row.product && row.product.id == productId) {
          isExist = true;
        }
      });

      // đã tồn tại trong bảng
      if (isExist) {
        message.error("Sản phẩm đã tồn tại trong phiếu kiểm");
      } else {
        let res = await productApi.findOneById(productId);
        if (res.isSuccess) {
          let _dataTable = dataTable.map((row) => {
            if (row.rowId == rowId) {
              return {
                ...row,
                utIdSelected: "",
                product: res.product,
              };
            }
            return row;
          });

          setDataTable(_dataTable);
        }
      }
    } else {
      let _dataTable = dataTable.map((row) => {
        if (row.rowId == rowId) {
          return {
            ...row,
            product: "",
            utIdSelected: "",

            quantity3: 0,
            quantity4: 0,
          };
        }
        return row;
      });
      setDataTable(_dataTable);
    }
  }

  function handleOnChangeUtIdSelect(utIdSelected, rowId) {
    if (utIdSelected) {
      let _dataTable = dataTable.map((row) => {
        if (row.rowId == rowId) {
          return {
            ...row,
            utIdSelected: utIdSelected,
          };
        }
        return row;
      });

      let convertionQuantity = 0;

      let quantity = 0;
      let quantity1 = 0;
      let quantity2 = 0;
      let quantity3 = 0;
      let quantity4 = 0;
      _dataTable = _dataTable.map((row) => {
        if (row.product && row.utIdSelected) {
          row.product.ProductUnitTypes.map((put) => {
            if (put.UnitTypeId == row.utIdSelected) {
              convertionQuantity = put.UnitType.convertionQuantity;
            }
          });
          let quantity = row.product.quantity;
          quantity2 = quantity4 = quantity % convertionQuantity;
          quantity1 = quantity3 = (quantity - quantity4) / convertionQuantity;

          if (convertionQuantity == 1) {
            return {
              ...row,
              quantity1: quantity1,
              quantity2: quantity2,
              quantity3: quantity3,
              quantity4: quantity4,
              quantity4Disabled: true,
            };
          } else {
            return {
              ...row,
              quantity1: quantity1,
              quantity2: quantity2,
              quantity3: quantity3,
              quantity4: quantity4,
              quantity4Disabled: false,
            };
          }
        }
        return {
          ...row,
          quantity4Disabled: false,
        };
      });

      setDataTable(_dataTable);
    }
  }

  async function onSubmit(type, isClose) {
    if (await checkData()) {
      let res = {};
      let formData = {};

      if (type == "create") {
        // loại bỏ những row rỗng
        let _dataTable = dataTable.filter((row) => row.product);
        if (_dataTable.length == 0) {
          message.error("Vui lòng thêm thông tin trước!");
        }

        let ticketDetails = [];

        for (const rowData of _dataTable) {
          let putId = await getPUTid(rowData.product.id, rowData.utIdSelected);
          if (putId) {
            ticketDetails.push({
              ProductUnitTypeId: putId,
              reportQty: rowData.quantity1 || 0,
              reportQtyBase: rowData.quantity2 || 0,
              realReportQty: rowData.quantity3 || 0,
              realBaseQty: rowData.quantity4 || 0,
            });
          }
        }

        try {
          formData = {
            id: formState.id,
            EmployeeId: formState.EmployeeId,
            note: formState.note,

            ticketDetails: ticketDetails,
          };

          hideLoading = message.loading("Đang tạo mới...", 0);
          console.log(formData);
          res = await storeApi.addTiket(formData);

          if (res.isSuccess) {
            message.info("Thao tác thành công");

            dispatch(setRefreshStoreTickets());
            handleAfter.createWareHouseTicket(formState.id);

            closeModal();
          }
        } catch (ex) {
          console.log("Có lỗi xảy ra, vui lòng thử lại!");
        }
      }

      if (hideLoading) {
        hideLoading();
      }
    } else {
      message.error("Vui lòng điền đầy đủ thông tin!");
    }

    async function checkData() {
      let isCheck = true;
      let _errMess = {};
      setErrMessage(_errMess);

      if (dataTable.length == 1) {
        isCheck = false;
      }

      dataTable.map((rowData) => {
        if (rowData.isLastRow) return;

        _errMess[rowData.rowId] = {};
        if (!rowData.product) {
          _errMess[rowData.rowId].product = "Không được bỏ trống!";
        }

        if (!rowData.utIdSelected) {
          _errMess[rowData.rowId].utIdSelected = "Không được bỏ trống!";
        }
      });

      Object.keys(_errMess).map((rowId) => {
        if (Object.keys(_errMess[rowId]).length != 0) {
          isCheck = false;
        }
      });

      setErrMessage(_errMess);

      return isCheck;
    }
  }

  useEffect(() => {
    if (modalState.type == "create" && modalState.visible) {
      setFormState({
        ...formState,
        id: "WHT" + uid(),
        EmployeeId: account.id,
        EmployeeName: account.name,
        createAt: new Date(),
      });
      setDataTable(initDataTable);
    }

    if (modalState.type == "view" && modalState.visible) {
      loadDetailWareHouseTicket(modalState.idSelected);
    }
    return () => {};
  }, [modalState]);

  async function loadDetailWareHouseTicket(id) {
    let res = {};

    res = await storeApi.getOneTicketById(id);
    if (res.isSuccess) {
      let ticket = res.ticket || {};

      setFormState({
        id: ticket.id,
        createAt: ticket.createAt,
        EmployeeId: ticket.EmployeeId,
        EmployeeName: ticket.Employee.name,
        note: ticket.note,
      });

      let ticketDetails = ticket.TicketDetails || [];

      let _dataTable = [];
      ticketDetails.map((ticketDetail) => {
        _dataTable.push({
          rowId: ticketDetail.id,
          product: ticketDetail.ProductUnitType.Product,
          utIdSelected: ticketDetail.ProductUnitType.UnitTypeId,
          quantity1: ticketDetail.reportQty,
          quantity2: ticketDetail.reportQtyBase,

          quantity3: ticketDetail.realReportQty,
          quantity4: ticketDetail.realBaseQty,
        });
      });

      setDataTable(_dataTable);
    }

    /**
     * set to form
     * set to table
     *
     */
  }

  return (
    <div className="price__modal">
      <ModalCustomer
        visible={modalState.visible}
        style={{
          width: "98%",
        }}
        closeModal={() => {
          dispatch(
            setOpen({
              name: "StoreCheckingModal",
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
              {modalState.type == "create"
                ? "Thêm mới phiếu kiểm kho"
                : "Xem thông tin phiếu kiểm kho"}
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="store_checking_modal_detail_form_top">
              <div className="store_checking_modal_detail_form_left">
                <div className="store_checking_modal_form_group">
                  <div className="store_checking_modal_form_label">
                    Mã phiếu kiểm
                  </div>
                  <div className="store_checking_modal_form_input_wrap">
                    <Input
                      className="store_checking_modal_form_input_number"
                      size="small"
                      disabled={true}
                      value={formState.id}
                    />
                  </div>
                </div>
                <div className="store_checking_modal_form_group">
                  <div className="store_checking_modal_form_label">
                    Mã nhân viên kiểm
                  </div>
                  <div className="store_checking_modal_form_input_wrap">
                    <Typography.Link
                      className="store_checking_modal_form_input_number"
                      size="small"
                    >
                      {formState.EmployeeId}
                    </Typography.Link>
                  </div>
                </div>
                <div className="store_checking_modal_form_group">
                  <div className="store_checking_modal_form_label">
                    Tên nhân viên
                  </div>
                  <div className="store_checking_modal_form_input_wrap">
                    {formState.EmployeeName}
                  </div>
                </div>

                <div className="store_checking_modal_form_group">
                  <div className="store_checking_modal_form_label">
                    Thời gian tạo phiếu
                  </div>
                  <div className="store_checking_modal_form_input_wrap">
                    <DatePicker
                      className="store_checking_modal_form_input_number"
                      size="small"
                      disabled={true}
                      value={
                        formState.createAt && sqlToAntd(formState.createAt)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="store_checking_modal_detail_form_right">
                <div className="store_checking_modal_form_group">
                  <div className="store_checking_modal_form_label">Ghi chú</div>
                  <div className="store_checking_modal_form_input_wrap">
                    <Input.TextArea
                      className="store_checking_modal_form_input_number"
                      size="small"
                      style={{
                        height: 90,
                        width: 700,
                      }}
                      value={formState.note}
                      onChange={({ target }) => {
                        setFormState({
                          ...formState,
                          note: target.value,
                        });
                      }}
                      disabled={modalState.type == "view"}
                    />
                  </div>
                </div>
              </div>
            </div>
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

            <Space
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {modalState.type == "create" && (
                <>
                  <Button
                    type="primary"
                    onClick={() => {
                      onSubmit("create", true);
                    }}
                  >
                    Hoàn tất
                  </Button>
                </>
              )}
              <Button
                type="primary"
                danger
                onClick={() => setModalState({ visible: false })}
              >
                Hủy bỏ
              </Button>
            </Space>
          </div>
        </div>
      </ModalCustomer>
    </div>
  );
};

export default StoreCheckingModal;
