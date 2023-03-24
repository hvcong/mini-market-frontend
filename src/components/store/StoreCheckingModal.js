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
import UnitTypeSelect from "../common/UnitTypeSelect";
import { DeleteOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";
import ProductIdIInputSearchSelect from "../common/ProductIdIInputSearchSelect";
import { uid } from "../../utils";
import productApi from "../../api/productApi";
import unitTypeApi from "./../../api/unitTypeApi";
import { useDispatch, useSelector } from "react-redux";
import storeApi from "./../../api/storeApi";
import UnitTypeSelectByProductId from "../promotion/UnitTypeSelectByProductId";
import { setRefreshStoreTrans } from "../../store/slices/storeTranSlice";
import { setOpen } from "../../store/slices/modalSlice";

const lastItemOfTable = {
  isLastRow: true,
};
const initDataTable = [
  // {
  //   rowId: "",
  //   product: "",
  //   utIdSelected: "",
  //   quantity1: 0,
  //   quantity2: 0,
  //   quantity3: 0,
  //   quantity4: 0,
  // },

  lastItemOfTable,
];

const initErrMessage = {
  // rowId: {
  //   product: "",
  //   utIdSelected: "",
  //   quantity1: "",
  //   quantity2: "",
  //   quantity3: "",
  //   quantity4: "",
  // },
};

const ddMMyyyy = "DD/MM/YYYY";

const StoreCheckingModal = () => {
  let hideLoading = null;
  const dispatch = useDispatch();
  const modalState =
    useSelector((state) => state.modal.modals["StoreCheckingModal"]) || {};
  const [allColumns, setAllColumns] = useState([]);
  const [dataTable, setDataTable] = useState(initDataTable);
  const [errMessage, setErrMessage] = useState(initErrMessage);

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
          } else {
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
                />
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
        title: "Đơn vị báo cáo",
        dataIndex: "product",

        render: (_, rowData) => {
          if (!rowData.isLastRow) {
            let productId = "";
            if (rowData.product) {
              productId = rowData.product.id;
            }

            return (
              <UnitTypeSelectByProductId
                style={{ width: 130 }}
                size="small"
                productId={productId}
                onChange={(utId) => {
                  handleOnChangeUtIdSelect(utId, rowData.rowId);
                }}
                value={rowData.utIdSelected}
              />
            );
          }
        },
      },
      {
        title: "Số lượng báo cáo",
        width: 120,
        dataIndex: "product",
        render: (_, rowData) => {
          if (!rowData.isLastRow) {
            let value = 0;
            let convertionQuantity = 0;
            let totalQuantity = rowData.product.quantity;
            if (rowData.product && rowData.utIdSelected) {
              rowData.product.ProductUnitTypes.map((put) => {
                if (put.UnitTypeId == rowData.utIdSelected) {
                  convertionQuantity = put.UnitType.convertionQuantity;
                }
              });
            }

            value =
              (totalQuantity - (totalQuantity % convertionQuantity)) /
                convertionQuantity || 0;

            return value;
          }
        },
      },
      {
        title: "Số lượng báo cáo lẻ ",
        width: 120,

        dataIndex: "product",
        render: (_, rowData) => {
          if (!rowData.isLastRow) {
            let value = 0;
            let convertionQuantity = 0;
            let totalQuantity = rowData.product.quantity;
            if (rowData.product && rowData.utIdSelected) {
              rowData.product.ProductUnitTypes.map((put) => {
                if (put.UnitTypeId == rowData.utIdSelected) {
                  convertionQuantity = put.UnitType.convertionQuantity;
                }
              });
            }

            value = totalQuantity % convertionQuantity || 0;

            return value;
          }
        },
      },
      {
        title: "Số lượng báo cáo thực tế",
        dataIndex: "product",
        render: (_, rowData) => {
          if (!rowData.isLastRow) {
            return (
              <InputNumber
                size="small"
                disabled={!rowData.product}
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
        title: "Số lượng lẻ thực tế",
        dataIndex: "product",
        render: (_, rowData) => {
          if (!rowData.isLastRow) {
            return (
              <InputNumber
                size="small"
                disabled={!rowData.product}
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
  }, [dataTable]);

  function addNewRow() {
    let newRow = {
      rowId: uid(),
      product: "",
      utIdSelected: "",
      quantity1: 0,
      quantity2: 0,
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
            quantity1: 0,
            quantity2: 0,
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
    let _dataTable = dataTable.map((row) => {
      if (row.rowId == rowId) {
        return {
          ...row,
          utIdSelected: utIdSelected,
        };
      }
      return row;
    });
    setDataTable(_dataTable);
  }

  async function onSubmit(type, isClose) {}

  return (
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
              {modalState.type == "update" ? "" : "Thêm mới phiếu kiểm kho"}
            </Typography.Title>
          </div>
          <div className="form__container">
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
              {modalState.type == "create" ? (
                <>
                  <Button
                    type="primary"
                    onClick={() => {
                      onSubmit("create");
                    }}
                  >
                    Lưu & Thêm mới
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      onSubmit("create", true);
                    }}
                  >
                    Lưu & Đóng
                  </Button>
                </>
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    onSubmit("create", true);
                  }}
                >
                  Cập nhật
                </Button>
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
