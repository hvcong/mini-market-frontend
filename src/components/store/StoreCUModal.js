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
const initErrMessage = {
  // rowId: {
  //   product: "",
  //   quantity: "",
  //   utSelectedId: "",
  // },
};

const ddMMyyyy = "DD/MM/YYYY";

const StoreCUModal = ({ modalState, setModalState }) => {
  let hideLoading = null;
  const dispatch = useDispatch();

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
          } else {
            return (
              <div class>
                <ProductIdIInputSearchSelect
                  value={rowData.product && rowData.product.id}
                  onChange={(productId) => {
                    addProductToRow(productId, index);
                  }}
                  style={{
                    width: 180,
                  }}
                  size="small"
                  status={
                    errMessage[rowData.id] &&
                    errMessage[rowData.id].product &&
                    "error"
                  }
                />
                <div className="store_changing_err">
                  {errMessage[rowData.id] && errMessage[rowData.id].product}
                </div>
              </div>
            );
          }
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
                <UnitTypeSelectByProductId
                  style={{
                    width: 160,
                  }}
                  onChange={(value) => {
                    if (value) {
                      setUTselectedId(value, index);
                    }
                  }}
                  productId={rowData.product && rowData.product.id}
                  status={
                    errMessage[rowData.id] &&
                    errMessage[rowData.id].utSelectedId &&
                    "error"
                  }
                  disabledValues={
                    rowData.product &&
                    disableListValuesUTSelect(rowData.product.id)
                  }
                  value={rowData.utSelectedId}
                  disabled={!(rowData.product && rowData.product.id)}
                  size="small"
                />
                <div className="store_changing_err">
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
              <div>
                <InputNumber
                  value={rowData.quantity}
                  onChange={(value) => {
                    if (value) {
                      setQuantity(value, index);
                    }
                  }}
                  min={1}
                  size="small"
                  status={
                    errMessage[rowData.id] &&
                    errMessage[rowData.id].quantity &&
                    "error"
                  }
                />
                <div className="store_changing_err">
                  {errMessage[rowData.id] && errMessage[rowData.id].quantity}
                </div>
              </div>
            );
          }
        },
      },
    ];

    setAllColumns(_allColumns);

    return () => {};
  }, [dataTable, errMessage]);

  function disableListValuesUTSelect(productId) {
    let list = [];

    dataTable.map((item) => {
      if (!item.isLastRow) {
        if (item.product && item.product.id == productId) {
          list.push(item.utSelectedId);
        }
      }
    });
    return list;
  }

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
            utList.filter((ut) => ut.id == utSelectedId)[0]
              ?.convertionQuantity || 0;

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

      hideLoading = message.loading("Đang cập nhật kho...", 0);
      let res = await storeApi.addMany(formData);
      if (res.isSuccess) {
        message.info("Nhập kho thành công");
        dispatch(setRefreshStoreTrans());

        if (isClose) {
          closeModal();
        } else {
          clearModal();
        }
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    }

    if (hideLoading) {
      hideLoading();
    }
    function checkData() {
      let isCheck = true;
      let _errMess = { ...errMessage };
      Object.keys(errMessage).map((key) => {
        _errMess[key] = {};
      });
      setErrMessage(_errMess);

      if (dataTable.length == 1) {
        isCheck = false;
        message.warning("Vui lòng thêm các dòng nhập kho!");
      } else {
        dataTable.map((row) => {
          if (!row.isLastRow) {
            if (!row.product) {
              _errMess[row.id].product = "Không được bỏ trống!";
            }

            if (!row.utSelectedId) {
              _errMess[row.id].utSelectedId = "Không được bỏ trống!";
            }

            if (!row.quantity) {
              _errMess[row.id].quantity = "Không được bỏ trống!";
            }
          }
        });
      }

      Object.keys(_errMess).map((key) => {
        if (_errMess[key]) {
          if (Object.keys(_errMess[key]).length != 0) {
            isCheck = false;
          }
        }
      });
      setErrMessage(_errMess);

      return isCheck;
    }
  }

  function closeModal() {
    setModalState({
      visible: false,
    });
    clearModal();
  }

  function clearModal() {
    setDataTable(initDataTable);
    setErrMessage({});
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
