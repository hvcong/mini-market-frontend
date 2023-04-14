import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  InputNumber,
  Popconfirm,
  Popover,
  Select,
  Table,
  Tag,
  message,
} from "antd";
import { Typography } from "antd";
import { PlusOutlined, DeleteOutlined, DiffOutlined } from "@ant-design/icons";
import { compareDMY, uid } from "../../utils";
import { codeVocherGenarate } from "../../utils";
import CopyVoucherButton from "./CopyVoucherButton";
import promotionApi from "../../api/promotionApi";

const typeMPs = [
  {
    value: "discountMoney",
    label: "Tiền",
  },
  {
    value: "discountRate",
    label: "Phần trăm (%)  ",
  },
];

const initRowData = {
  id: uid(),
  code: "",
  discountMoney: 0,
  discountRate: 0,
  maxDiscountMoney: 0,
  type: "discountMoney",
};

const VoucherPromotion = ({
  tableData,
  setTableData,
  setLvErrMessage,
  lvErrMessage,
  modalState,
}) => {
  const [allColumns, setAllColumns] = useState([]);
  const [time, setTime] = useState({
    startDate: "",
    endDate: "",
  });

  async function handleOnChange(rowId, name, value) {
    clearItemMessage(rowId, name);

    let _tableData = tableData.map((rowData) => {
      if (rowId == rowData.id) {
        if (name == "type") {
          return {
            ...rowData,
            discountMoney: 0,
            discountRate: 0,
            maxDiscountMoney: 0,
            [name]: value,
          };
        }

        return {
          ...rowData,
          [name]: value,
        };
      } else {
        return rowData;
      }
    });

    if (name == "code") {
      if (checkExistCode(value)) {
        setLvErrMessage({
          ...lvErrMessage,
          [rowId]: {
            ...lvErrMessage[rowId],
            code: "Mã code đã được sử dụng",
          },
        });
      }
    }

    setTableData(_tableData);
  }

  function clearItemMessage(rowId, name) {
    setLvErrMessage({
      ...lvErrMessage,
      [rowId]: {
        ...lvErrMessage[rowId],
        [name]: "",
      },
    });
  }

  function checkExistCode(code) {
    let isExist = false;
    tableData.map((rowData) => {
      if (!rowData.isLastRow) {
        if (rowData.code == code) {
          isExist = true;
        }
      }
    });
    return isExist;
  }

  useEffect(() => {
    setAllColumns([
      {
        title: "",
        dataIndex: "id",
        width: 24,
        render: (id, rowData) => {
          if (!rowData.isLastRow) {
            return (
              <Button
                size="small"
                danger
                disabled={disableInputInTable("btnDelete", rowData)}
                icon={<DeleteOutlined />}
                onClick={() => deleteRow(id)}
              />
            );
          }
        },
      },
      {
        title: "STT",
        width: 24,
        render: (_, rowData, index) => {
          if (!rowData.isLastRow) {
            return index + 1;
          }
        },
      },
      {
        title: "Mã CODE",
        dataIndex: "code",
        render: (code, rowData) => {
          if (!rowData.isLastRow) {
            return (
              <div className="promotion_voucher_create_input_wrap">
                <Input
                  value={code}
                  size="small"
                  disabled={disableInputInTable("code", rowData)}
                  className="promotion_voucher_create_input"
                  onChange={({ target }) => {
                    handleOnChange(rowData.id, "code", target.value);
                  }}
                  status={
                    lvErrMessage[rowData.id] &&
                    lvErrMessage[rowData.id].code &&
                    "error"
                  }
                />
                <div className="promotion_voucher_create_input_err">
                  {lvErrMessage[rowData.id] && lvErrMessage[rowData.id].code}
                </div>
              </div>
            );
          }

          return (
            <Button
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => {
                addNewRow();
              }}
            >
              Thêm mới dòng
            </Button>
          );
        },
      },
      {
        title: "Hình thức chiết khấu",
        dataIndex: "type",
        render: (type, rowData) => {
          if (!rowData.isLastRow) {
            return (
              <div className="promotion_voucher_create_input_wrap">
                <Select
                  size="small"
                  disabled={disableInputInTable("type", rowData)}
                  className="promotion_voucher_create_input"
                  options={typeMPs}
                  value={type}
                  onChange={(value) => {
                    handleOnChange(rowData.id, "type", value);
                  }}
                />
              </div>
            );
          }
        },
      },
      {
        title: "Số tiền chiết khấu",
        dataIndex: "discountMoney",
        render: (discountMoney, rowData) => {
          if (!rowData.isLastRow) {
            return (
              <div className="promotion_voucher_create_input_wrap">
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  size="small"
                  className="promotion_voucher_create_number"
                  value={discountMoney}
                  min={0}
                  onChange={(value) => {
                    handleOnChange(rowData.id, "discountMoney", value);
                  }}
                  disabled={
                    rowData.type == "discountRate" ||
                    disableInputInTable("discountMoney", rowData)
                  }
                  status={
                    lvErrMessage[rowData.id] &&
                    lvErrMessage[rowData.id].discountMoney &&
                    "error"
                  }
                />
                <div className="promotion_voucher_create_input_err">
                  {lvErrMessage[rowData.id] &&
                    lvErrMessage[rowData.id].discountMoney}
                </div>
              </div>
            );
          }
        },
      },
      {
        title: "% chiếu khấu",
        dataIndex: "discountRate",
        render: (discountRate, rowData) => {
          if (!rowData.isLastRow) {
            return (
              <div className="promotion_voucher_create_input_wrap">
                <InputNumber
                  size="small"
                  className="promotion_voucher_create_number"
                  min={0}
                  max={100}
                  value={discountRate}
                  onChange={(value) => {
                    handleOnChange(rowData.id, "discountRate", value);
                  }}
                  disabled={
                    rowData.type == "discountMoney" ||
                    disableInputInTable("discountRate", rowData)
                  }
                  status={
                    lvErrMessage[rowData.id] &&
                    lvErrMessage[rowData.id].discountRate &&
                    "error"
                  }
                />
                <div className="promotion_voucher_create_input_err">
                  {lvErrMessage[rowData.id] &&
                    lvErrMessage[rowData.id].discountRate}
                </div>
              </div>
            );
          }
        },
      },
      {
        title: "Số tiền tối đa",
        dataIndex: "maxDiscountMoney",
        render: (maxDiscountMoney, rowData) => {
          if (!rowData.isLastRow) {
            return (
              <div className="promotion_voucher_create_input_wrap">
                <InputNumber
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  size="small"
                  className="promotion_voucher_create_number"
                  min={0}
                  value={maxDiscountMoney}
                  onChange={(value) => {
                    handleOnChange(rowData.id, "maxDiscountMoney", value);
                  }}
                  disabled={
                    rowData.type == "discountMoney" ||
                    disableInputInTable("maxDiscountMoney", rowData)
                  }
                  status={
                    lvErrMessage[rowData.id] &&
                    lvErrMessage[rowData.id].maxDiscountMoney &&
                    "error"
                  }
                />
                <div className="promotion_voucher_create_input_err">
                  {lvErrMessage[rowData.id] &&
                    lvErrMessage[rowData.id].maxDiscountMoney}
                </div>
              </div>
            );
          }
        },
      },
      {
        title: "Tình trạng",
        dataIndex: "used",
        render: (used, rowData) => {
          if (!rowData.isLastRow) {
            if (used) {
              return <Tag color="red">Đã sử dụng</Tag>;
            } else {
              return <Tag color="red">Chưa sử dụng</Tag>;
            }
          }
        },
      },
      {
        title: "",
        width: 32,
        render: (_, rowData) => {
          if (!rowData.isLastRow) {
            return (
              <CopyVoucherButton
                disabled={disableInputInTable("addMore", rowData)}
                addNewMore={(quantity) => {
                  addNewMore(rowData, quantity);
                }}
              />
            );
          }
        },
      },
    ]);
    return () => {};
  }, [tableData, lvErrMessage, time]);

  useEffect(() => {
    if (modalState.type != "create" && modalState.idSelected) {
      loadGroupVoucher(modalState.idSelected);
    }
    return () => {};
  }, [modalState]);

  async function loadGroupVoucher(voucherId) {
    // load group theo id

    let res = await promotionApi.getOneVById(voucherId);
    if (res.isSuccess) {
      let voucher = res.voucher;
      let groupVoucher = voucher.groupVoucher;
      res = await promotionApi.getAllByGroup(groupVoucher);
      if (res.isSuccess) {
        let vouches = res.vouches || [];

        let _tableData = vouches.map((voucher) => {
          return {
            id: voucher.id,
            code: voucher.code,
            discountMoney: voucher.discountMoney || 0,
            discountRate: voucher.discountRate || 0,
            maxDiscountMoney: voucher.maxDiscountMoney || 0,
            type: voucher.type,
            used: voucher.PromotionResult && true,
            isExistInDB: true,
          };
        });

        if (voucher) {
          setTime({
            startDate: voucher.startDate,
            endDate: voucher.endDate,
          });
          let start = new Date(voucher.startDate);
          let end = new Date(voucher.endDate);
          let now = new Date();
          let state = voucher.state;

          if (compareDMY(start, now) > 0) {
            // Sắp tới

            _tableData.push({
              isLastRow: true,
            });
          }
        }

        setTableData(_tableData);
      }
    }
  }

  function addNewRow() {
    let _tableData = [...tableData];
    let length = _tableData.length;
    let id = uid();
    let newRow = {
      ...initRowData,
      id,
      code: codeVocherGenarate(),
    };
    _tableData[length - 1] = newRow;
    _tableData.push({
      isLastRow: true,
    });

    setTableData(_tableData);

    //add message
    let _errMess = { ...lvErrMessage };
    _errMess[id] = {};
    setLvErrMessage(_errMess);
  }

  function addNewMore(rowData, quantity) {
    let _tableData = [...tableData];
    let _errMess = { ...lvErrMessage };

    for (let i = 0; i < quantity; i++) {
      let length = _tableData.length;
      let id = uid();
      let newRow = {
        ...rowData,
        isExistInDB: false,
        id,
        code: codeVocherGenarate(),
      };
      _tableData[length - 1] = newRow;
      _tableData.push({
        isLastRow: true,
      });
      // add message
      _errMess[id] = {};
    }

    setTableData(_tableData);

    // add message
    setLvErrMessage(_errMess);
  }

  function deleteRow(rowId) {
    let _tableData = tableData.filter((rowData) => rowData.id != rowId);

    setTableData(_tableData);
    let _errMess = { ...lvErrMessage };
    _errMess[rowId] = null;
    setLvErrMessage(_errMess);
  }

  function disableInputInTable(name, rowData) {
    if (time) {
      let start = new Date(time.startDate);
      let end = new Date(time.endDate);
      let now = new Date();
      let isFuture = false;
      let isExistInDB = rowData.isExistInDB;
      let used = rowData.used;

      if (compareDMY(start, now) > 0) {
        // Sắp tới
        isFuture = true;
      }

      if (isFuture) {
        return false;
      }

      if (isExistInDB) {
        return true;
      }

      if (name == "btnDelete") {
      }
    }
  }

  return (
    <>
      <Typography.Title level={5} className="voucher_modal_bottom_title">
        Phiếu giảm giá
      </Typography.Title>

      <div className="voucher_modal_bottom_create">
        <div className="voucher_line_modal">
          <Table
            columns={allColumns}
            size="small"
            dataSource={tableData}
            pagination={false}
            className="table"
          />
        </div>
      </div>
    </>
  );
};

export default VoucherPromotion;
