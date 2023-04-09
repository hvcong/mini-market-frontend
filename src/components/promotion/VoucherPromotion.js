import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  InputNumber,
  Popconfirm,
  Popover,
  Select,
  Table,
} from "antd";
import { Typography } from "antd";
import { PlusOutlined, DeleteOutlined, DiffOutlined } from "@ant-design/icons";
import { uid } from "../../utils";
import { codeVocherGenarate } from "../../utils";
import CopyVoucherButton from "./CopyVoucherButton";

const typeMPs = [
  {
    value: "discountMoney",
    label: "Tiền",
  },
  // {
  //   value: "discountRate",
  //   label: "Phần trăm (%)  ",
  // },
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
}) => {
  const [allColumns, setAllColumns] = useState([]);

  function handleOnChange(rowId, name, value) {
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
                  disabled={rowData.type == "discountRate"}
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
      // {
      //   title: "% chiếu khấu",
      //   dataIndex: "discountRate",
      //   render: (discountRate, rowData) => {
      //     if (!rowData.isLastRow) {
      //       return (
      //         <div className="promotion_voucher_create_input_wrap">
      //           <InputNumber
      //             size="small"
      //             className="promotion_voucher_create_number"
      //             min={0}
      //             max={100}
      //             value={discountRate}
      //             onChange={(value) => {
      //               handleOnChange(rowData.id, "discountRate", value);
      //             }}
      //             disabled={rowData.type == "discountMoney"}
      //             status={
      //               lvErrMessage[rowData.id] &&
      //               lvErrMessage[rowData.id].discountRate &&
      //               "error"
      //             }
      //           />
      //           <div className="promotion_voucher_create_input_err">
      //             {lvErrMessage[rowData.id] &&
      //               lvErrMessage[rowData.id].discountRate}
      //           </div>
      //         </div>
      //       );
      //     }
      //   },
      // },
      // {
      //   title: "Số tiền tối đa",
      //   dataIndex: "maxDiscountMoney",
      //   render: (maxDiscountMoney, rowData) => {
      //     if (!rowData.isLastRow) {
      //       return (
      //         <div className="promotion_voucher_create_input_wrap">
      //           <InputNumber
      //             formatter={(value) =>
      //               `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      //             }
      //             parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
      //             size="small"
      //             className="promotion_voucher_create_number"
      //             min={0}
      //             value={maxDiscountMoney}
      //             onChange={(value) => {
      //               handleOnChange(rowData.id, "maxDiscountMoney", value);
      //             }}
      //             disabled={rowData.type == "discountMoney"}
      //             status={
      //               lvErrMessage[rowData.id] &&
      //               lvErrMessage[rowData.id].maxDiscountMoney &&
      //               "error"
      //             }
      //           />
      //           <div className="promotion_voucher_create_input_err">
      //             {lvErrMessage[rowData.id] &&
      //               lvErrMessage[rowData.id].maxDiscountMoney}
      //           </div>
      //         </div>
      //       );
      //     }
      //   },
      // },
      {
        title: "",
        width: 32,
        render: (_, rowData) => {
          if (!rowData.isLastRow) {
            return (
              <CopyVoucherButton
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
  }, [tableData, lvErrMessage]);

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
