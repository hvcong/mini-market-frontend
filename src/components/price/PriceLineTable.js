import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Popover, Typography, message } from "antd";
import DropSelectColum from "../product/DropSelectColum";
import { Table } from "antd";
import { compareDMY, convertToVND, sqlToDDmmYYY } from "../../utils";
import priceLineApi from "../../api/priceLineApi";
import {
  setPriceLines,
  setRefreshPriceLines,
} from "../../store/slices/priceLineSlice";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import PriceLineModal from "./priceLineModal";
import ExportExcelButton from "../common/ExportExcelButton";
import ImportExcelButton from "../common/ImportExcelButton";
import DownLoadTemplate from "../common/DownLoadTemplate";

const PriceLineTable = ({
  headerPriceId,
  headerState,
  endDateHeader,
  isDisabledAddButton,
  disabledItem,
}) => {
  const { priceLines, refresh } = useSelector((state) => state.priceLine);
  const dispatch = useDispatch();
  const [modalState, setModalState] = useState({
    visible: false,
    type: "",
    rowSelected: null,
  });
  const { isAdmin } = useSelector((state) => state.user);

  const [allColumns, setAllColumns] = useState([]);

  useEffect(() => {
    if (headerPriceId) {
      getAllLinesByHeaderId(headerPriceId);
      let _allCols = [
        {
          title: "Mã sản phẩm",
          width: 160,
          render: (_, rowData) => {
            if (rowData) {
              return <div>{rowData.ProductUnitType.ProductId}</div>;
            }
          },
        },
        {
          title: "Tên sản phẩm",
          width: 160,
          render: (_, rowData) => {
            if (rowData) {
              return rowData.ProductUnitType.Product.name;
            }
          },
        },
        {
          title: "Mã đơn vị tính",
          width: 120,

          render: (_, rowData) => {
            if (rowData) {
              return <>{rowData.ProductUnitType.UnitTypeId}</>;
            }
          },
        },
        {
          title: "Tên đơn vị tính",
          hidden: true,

          width: 160,
          render: (_, rowData) => {
            if (rowData) {
              return rowData.ProductUnitType.UnitType.name;
            }
          },
        },
        {
          title: "Giá",
          dataIndex: "price",
          width: 120,
          align: "right",
          render: (price) => {
            return convertToVND(price);
          },
        },
        {
          title: "Hành động",
          dataIndex: "id",
          width: 80,
          fixed: "right",
          fixedShow: true,
          render: (_, row) => (
            <>
              <Button
                size="small"
                icon={
                  <EditOutlined
                    onClick={() => {
                      setModalState({
                        type: "update",
                        visible: true,
                        rowSelected: row,
                      });
                    }}
                  />
                }
              />
              <Button
                style={{
                  marginLeft: 8,
                }}
                disabled={disabledItem("btnDelete")}
                danger
                size="small"
                icon={
                  <DeleteOutlined
                    onClick={() => {
                      deleteOnePriceById(row.id);
                    }}
                  />
                }
              />
            </>
          ),
        },
      ];
      setAllColumns(_allCols);
    }
    return () => {};
  }, [headerPriceId, headerState]);

  useEffect(() => {
    if (refresh) {
      getAllLinesByHeaderId(headerPriceId);
    }

    return () => {};
  }, [refresh]);

  async function getAllLinesByHeaderId(headerPriceId) {
    let res = await priceLineApi.getByHeaderId(headerPriceId);
    if (res.isSuccess) {
      setTimeout(() => {
        dispatch(setPriceLines(res.listPrices));
      }, 500);
    } else {
    }
  }

  async function deleteOnePriceById(id) {
    let res = await priceLineApi.deleteOneById(id);
    if (res.isSuccess) {
      setTimeout(() => {
        message.info("Thao tác thành công", 3);
        dispatch(setRefreshPriceLines());
      }, 500);
    } else {
      message.info("Có lỗi xảy ra, vui lòng thử lại!");
    }
  }

  let dataToExport = priceLines.map((item) => {
    return {
      productId: item.ProductUnitType.Product.id,
      productName: item.ProductUnitType.Product.name,
      unitTypeId: item.ProductUnitType.UnitType.id,
      convertionQuantity: item.ProductUnitType.UnitType.convertionQuantity,
      price: item.price,
    };
  });

  return (
    <div>
      <div className="table__header">
        <div className="left">
          <Typography.Title
            level={5}
            style={{
              margin: 0,
            }}
          >
            Danh sách dòng giá{" "}
          </Typography.Title>
        </div>

        {isAdmin && (
          <div className="btn__item">
            <Popover
              placement="leftTop"
              content={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      marginBottom: 4,
                    }}
                  >
                    <ExportExcelButton
                      data={dataToExport}
                      nameTemplate={"price"}
                      title={"Bảng giá tháng 3"}
                    />
                  </div>
                  <div
                    style={{
                      marginBottom: 4,
                    }}
                  >
                    <DownLoadTemplate
                      nameTemplate={"price"}
                      title={"Mẫu nhập giá"}
                    />
                  </div>
                  <div
                    style={{
                      marginBottom: 4,
                    }}
                  >
                    <ImportExcelButton
                      disabled={isDisabledAddButton}
                      templateName="price"
                      priceHeaderId={headerPriceId}
                      oldData={priceLines.map((item) => {
                        return {
                          productId: item.ProductUnitType.ProductId,
                          unitTypeId: item.ProductUnitType.UnitType.id,
                          price: item.price,
                          putId: item.ProductUnitType.id,
                        };
                      })}
                    />
                  </div>
                </div>
              }
            >
              <Button>Nhập / Xuất bằng file</Button>
            </Popover>
          </div>
        )}

        <div className="btn__item">
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            style={{
              marginRight: "12px",
            }}
            onClick={() => {
              setModalState({
                type: "create",
                visible: true,
              });
            }}
            disabled={isDisabledAddButton}
          >
            Thêm mới một dòng
          </Button>
          <DropSelectColum
            allColumns={allColumns}
            setAllColumns={setAllColumns}
          />
        </div>
      </div>
      <Table
        columns={allColumns.filter((col) => !col.hidden)}
        dataSource={priceLines}
        pagination={false}
        size="small"
        scroll={{
          x: allColumns.filter((item) => !item.hidden).length * 150,
          y: window.innerHeight * 0.5,
        }}
        className="table"
      />
      <PriceLineModal
        modalState={modalState}
        setModalState={setModalState}
        headerPriceId={headerPriceId}
        disabledItem={disabledItem}
      />
    </div>
  );
};

export default PriceLineTable;
