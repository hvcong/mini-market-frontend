import React, { useEffect, useState } from "react";
import { message, Table, Typography } from "antd";
import { Button } from "antd";
import { GiftOutlined, PlusOutlined } from "@ant-design/icons";
import DropSelectColum from "../product/DropSelectColum";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import promotionApi from "./../../api/promotionApi";
import { setPromotionLines } from "../../store/slices/promotionLineSlice";
import { sqlToDDmmYYY, uid } from "./../../utils/index";
import PromotionLineModal from "./../promotion/PromotionLineModal";
import billApi from "./../../api/billApi";

let initDataTable = [
  // {
  //   id: "",
  //   quantity: "",
  //   price: "",
  //   productId: "",
  //   utName: "",
  //   utId: "",
  // },
];

const BillLineTable = ({ BillDetails = [], listKM = [] }) => {
  let hideLoading = null;
  const dispatch = useDispatch();
  const [modalState, setModalState] = useState({});
  const [tableData, setTableData] = useState(initDataTable);

  const [allColumns, setAllColumns] = useState([
    {
      title: "Loại",
      dataIndex: "isGift",
      width: 64,
      render: (isGift) => {
        return isGift ? (
          <GiftOutlined
            style={{
              fontSize: "20px",
              color: "palevioletred",
              cursor: "pointer",
            }}
          />
        ) : (
          ""
        );
      },
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "productId",
      width: 200,
      render: (productId) => {
        return <Typography.Link>{productId}</Typography.Link>;
      },
    },

    {
      title: "Mã vị tính",
      dataIndex: "utId",
      render: (utId) => {
        return <Typography.Link>{utId}</Typography.Link>;
      },
    },

    {
      title: "Số lượng",
      dataIndex: "quantity",
      render: (quantity) => {
        return quantity;
      },
    },

    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (price, rowData) => {
        if (!rowData.isGift) {
          return price;
        } else {
          return 0;
        }
      },
    },
  ]);

  useEffect(() => {
    if (BillDetails) {
      let _dataTable = [];
      BillDetails.map((bLine) => {
        _dataTable.push({
          id: bLine.id,
          quantity: bLine.quantity,
          price: bLine.Price.price,
          productId: bLine.Price.ProductUnitType.ProductId,
          utName: bLine.Price.ProductUnitType.UnitType.name,
          utId: bLine.Price.ProductUnitType.UnitType.id,
        });
      });

      try {
        // nhung san pham dc khuyen mai
        listKM.map((result) => {
          if (
            result.isSuccess == true &&
            result.type == "PP" &&
            result.ProductPromotion
          ) {
            let PP = result.ProductPromotion || {};
            let giftProduct = PP.GiftProduct || {};
            let put2 = giftProduct.ProductUnitType || {};
            console.log(put2);
            let quantityGift = giftProduct.quantity;
            let productGift = put2.Product || {};
            let unitTypeGift = put2.UnitType || {};
            let newRow = {
              id: uid(),
              quantity: quantityGift,
              price: 0,
              productId: productGift.id,
              utName: unitTypeGift.name,
              utId: unitTypeGift.id,
              isGift: true,
            };

            _dataTable.push(newRow);
          }
        });
      } catch (ex) {
        console.log("data err");
      }
      setTableData(_dataTable);
    }

    return () => {};
  }, [BillDetails, listKM]);

  function onClickRowId(rowData) {
    setModalState({
      type: "update",
      visible: true,
      rowSelected: rowData,
    });
  }

  return (
    <div className="promotion_header_form_bottom">
      <div className="table__header">
        <div className="left">
          <Typography.Title level={5} style={{}}>
            Danh sản phẩm trong hóa đơn{" "}
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
        dataSource={tableData}
        pagination={false}
        size="small"
        scroll={{
          x: allColumns.filter((item) => !item.hidden).length * 150,
          y: window.innerHeight * 0.5,
        }}
        className="table"
      />
    </div>
  );
};

export default BillLineTable;
