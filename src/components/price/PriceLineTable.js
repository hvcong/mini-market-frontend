import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Typography } from "antd";
import DropSelectColum from "../product/DropSelectColum";
import { Table } from "antd";
import { sqlToDDmmYYY } from "../../utils";
import priceLineApi from "../../api/priceLineApi";
import { setPriceLines } from "../../store/slices/priceLineSlice";
import { PlusOutlined } from "@ant-design/icons";
import PriceLineModal from "./priceLineModal";

const PriceLineTable = ({ headerPriceId, startDateHeader, endDateHeader }) => {
  const { priceLines, refresh } = useSelector((state) => state.priceLine);
  const dispatch = useDispatch();
  const [modalState, setModalState] = useState({
    visible: false,
    type: "",
    rowSelected: null,
  });

  const [allColumns, setAllColumns] = useState([
    {
      title: "Mã giá",
      dataIndex: "id",
      width: 120,
      fixed: "left",
      fixedShow: true,
      render: (_, row) => (
        <Typography.Link
          onClick={() => {
            setModalState({
              type: "update",
              visible: true,
              rowSelected: row,
            });
          }}
        >
          {row.id}
        </Typography.Link>
      ),
    },
    {
      title: "Mã sản phẩm",
      width: 160,
      render: (_, rowData) => {
        if (rowData) {
          return (
            <Typography.Link>
              {rowData.ProductUnitType.ProductId}
            </Typography.Link>
          );
        }
      },
    },
    {
      title: "Tên sản phẩm",
      width: 160,
      hidden: true,
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
          return (
            <Typography.Link>
              {rowData.ProductUnitType.UnitTypeId}
            </Typography.Link>
          );
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
    },
  ]);

  useEffect(() => {
    if (headerPriceId) {
      getAllLinesByHeaderId(headerPriceId);
    }
    return () => {};
  }, [headerPriceId]);

  useEffect(() => {
    if (refresh) {
      getAllLinesByHeaderId(headerPriceId);
    }

    return () => {};
  }, [refresh]);

  async function getAllLinesByHeaderId(headerPriceId) {
    let res = await priceLineApi.getByHeaderId(headerPriceId);
    if (res.isSuccess) {
      dispatch(setPriceLines(res.listPrices));
    }
  }

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

        <div className="btn__item">
          <Button
            type="dashed"
            size="small"
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
        startDateHeader={startDateHeader}
        endDateHeader={endDateHeader}
      />
    </div>
  );
};

export default PriceLineTable;
