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
import { useSelector } from "react-redux";
import storeApi from "./../../api/storeApi";

const initErrMessage = {
  // rowId: {
  //   product: "",
  //   quantity: "",
  //   utSelectedId: "",
  // },
};

const lastItemOfTable = {
  isLastRow: true,
};
const initDataTable = [
  // {
  //   id:'',
  //   product:'',
  //   listUTs:[],
  //   quantity:'',
  //    utSelectedId:''
  // }
  lastItemOfTable,
];

const ddMMyyyy = "DD/MM/YYYY";

const StoreCUModal = ({ modalState, setModalState }) => {
  const [allColumns, setAllColumns] = useState([]);
  const [dataTable, setDataTable] = useState(initDataTable);
  const [errMessage, setErrMessage] = useState(initErrMessage);
  const { account } = useSelector((state) => state.user);

  useEffect(() => {
    let _allColumns = [
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
                  onAddNewRow();
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
                      removeRowById(rowData.id);
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
        width: 200,
        dataIndex: "availableBudget",
        render: (_, rowData, index) => {
          if (rowData.isLastRow) {
            return null;
          }
          return (
            <ProductIdIInputSearchSelect
              addProductToRow={addProductToRow}
              index={index}
              style={{
                width: 180,
              }}
            />
          );
        },
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "availableBudget",
        width: 360,
        render: (_, rowData) => {
          if (rowData.isLastRow) {
            return null;
          } else {
            return rowData.product && rowData.product.name;
          }
        },
      },
      {
        title: "Đơn vị tính",
        width: 200,
        dataIndex: "availableBudget",
        render: (_, rowData, index) => {
          if (rowData.isLastRow) {
            return null;
          } else {
            return (
              <>
                <UnitTypeSelect
                  style={{
                    width: 160,
                  }}
                  listUTs={rowData.listUTs}
                  utSelectedId={rowData.utSelectedId}
                  setUTselectedId={setUTselectedId}
                  index={index}
                  dataTable={dataTable}
                  status={
                    errMessage[rowData.id] &&
                    errMessage[rowData.id].utSelectedId &&
                    "error"
                  }
                  value={rowData.utSelectedId}
                  disabled={!rowData.product}
                />
                <div className="err_message">
                  {errMessage[rowData.id] &&
                    errMessage[rowData.id].utSelectedId}{" "}
                </div>
              </>
            );
          }
        },
      },
      {
        title: "Số lượng nhập",
        width: 120,
        dataIndex: "availableBudget",
        render: (_, rowData, index) => {
          if (rowData.isLastRow) {
            return null;
          } else {
            return (
              <InputNumber
                value={rowData.quantity}
                onChange={(value) => {
                  if (value) {
                    setQuantity(value, index);
                  }
                }}
                min={1}
              />
            );
          }
        },
      },
    ];

    setAllColumns(_allColumns);

    return () => {};
  }, [dataTable]);

  function onAddNewRow() {
    let _dataTable = [...dataTable];
    let length = _dataTable.length;
    let id = uid();
    _dataTable[length - 1] = {
      id,
      quantity: 1,
    };
    _dataTable.push(lastItemOfTable);

    let _errMess = { ...errMessage };
    _errMess[id] = {};
    setErrMessage(_errMess);
    setDataTable(_dataTable);
  }

  function removeRowById(id) {
    let _dataTable = dataTable.filter((item) => item.id != id);
    setDataTable(_dataTable);
  }

  async function addProductToRow(productId, index) {
    if (productId) {
      let product;
      let listUTs;
      let res = await productApi.findById(productId);
      if (res.isSuccess) {
        product = res.product;
      }
      let res2 = await unitTypeApi.findAllByProductId(productId);
      if (res2.isSuccess) {
        listUTs = res2.unitTypes;
      }

      let _dataTable = [...dataTable];
      _dataTable[index].product = product;
      _dataTable[index].listUTs = listUTs;
      setDataTable(_dataTable);
    } else {
      let _dataTable = [...dataTable];
      _dataTable[index].product = "";
      _dataTable[index].listUTs = [];
      _dataTable[index].utSelectedId = "";

      setDataTable(_dataTable);
    }
  }

  function setUTselectedId(utId, index) {
    let _dataTable = [...dataTable];
    _dataTable[index].utSelectedId = utId;
    setDataTable(_dataTable);
  }

  function setQuantity(quantity, index) {
    let _dataTable = [...dataTable];
    _dataTable[index].quantity = quantity;
    setDataTable(_dataTable);
  }

  async function onSubmit(type, isClose) {
    if (checkData()) {
      // message.info("oke");
    }

    let _data = {
      // productId:quantity
    };

    dataTable.map((item) => {
      if (item.isLastRow) {
        return;
      } else {
        let quantity = item.quantity;
        let productId = item.product.id;
        let utList = item.listUTs;
        let utSelectedId = item.utSelectedId;
        let convertionQuantity =
          utList.filter((ut) => ut.id == utSelectedId)[0]?.convertionQuantity ||
          0;

        if (_data[productId]) {
          _data[productId] += quantity * convertionQuantity;
        } else {
          _data[productId] = 0;
          _data[productId] += quantity * convertionQuantity;
        }
      }
    });

    let productIds = Object.keys(_data);

    let formData = {
      data: productIds.map((productId) => ({
        quantity: _data[productId],
        productId,
        type: "Nhập kho",
        employeeId: account?.id,
      })),
    };

    console.log(formData);
    let res = await storeApi.addMany(formData);
    console.log(res);
    if (res.isSuccess) {
      message.info("oke");
    } else {
      message.error("error");
    }

    function checkData() {
      let isCheck = true;

      return isCheck;
    }
  }

  return (
    <div className="price__modal">
      <ModalCustomer visible={modalState.visible}>
        <div>
          <div className="title__container">
            <Typography.Title level={4} className="title">
              {modalState.type == "update" ? "" : "Nhập kho"}
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
                  Danh sách sản phẩm{" "}
                </Typography.Title>
                {/* <div className="search__container">
                  <SearchProduct
                    placeholder="Tìm kiếm sản phẩm"
                    style={{
                      width: "280px",
                    }}
                  />
                </div> */}
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

export default StoreCUModal;
