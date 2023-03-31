import React, { useEffect, useState } from "react";
import { message, Table, Tag, Typography } from "antd";
import { Button } from "antd";
import {
  BulbOutlined,
  GifOutlined,
  GiftFilled,
  GiftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import DropSelectColum from "../product/DropSelectColum";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import promotionApi from "./../../api/promotionApi";
import { setPromotionLines } from "../../store/slices/promotionLineSlice";
import { convertToVND, sqlToDDmmYYY, uid } from "./../../utils/index";
import PromotionLineModal from "./../promotion/PromotionLineModal";
import billApi from "./../../api/billApi";
import { setOpen } from "../../store/slices/modalSlice";

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
  const [tableData, setTableData] = useState(initDataTable);
  const [MPused, setMPused] = useState(null);

  const [allColumns, setAllColumns] = useState([]);

  useEffect(() => {
    if (BillDetails) {
      let _dataTable = [];

      // first row for total
      _dataTable.push({
        isFirstRow: true,
        isColNotData: true,
      });

      BillDetails.map((bLine) => {
        _dataTable.push({
          id: bLine.id,
          quantity: bLine.quantity,
          price: bLine.Price.price,
          productId: bLine.Price.ProductUnitType.ProductId,
          productName: bLine.Price.ProductUnitType.Product.name,
          utName: bLine.Price.ProductUnitType.UnitType.name,
          putId: bLine.Price.ProductUnitType.id,
          utId: bLine.Price.ProductUnitType.UnitType.id,
        });
      });

      try {
        // nhung khuyến mãi được áp dụng
        listKM.map((result) => {
          let isSuccess = result.isSuccess;
          let type = result.type;

          // PP
          if (isSuccess && type == "PP") {
            let PP = result.ProductPromotion || {};
            let giftProduct = PP.GiftProduct || {};
            let put2 = giftProduct.ProductUnitType || {};
            let quantityGift = giftProduct.quantity;
            let productGift = put2.Product || {};
            let unitTypeGift = put2.UnitType || {};
            let newRow = {
              id: uid(),
              quantity: quantityGift,
              price: 0,
              productId: productGift.id,
              productName: productGift.name,
              utName: unitTypeGift.name,
              utId: unitTypeGift.id,
              isGift: true,
              isPromotion: true,
              ProductPromotion: result.ProductPromotion,
            };

            _dataTable.push(newRow);
          }

          // MP
          if (isSuccess && type == "MP") {
            setMPused(result.MoneyPromotion);
            _dataTable.splice(1, 0, {
              isSecondRow: true,
              isColNotData: true,
            });
          }

          if (isSuccess && type == "DRP") {
            let proDRP = result.DiscountRateProduct;

            _dataTable = _dataTable.map((row) => {
              if (!row.isFirstRow) {
                if (row.putId == proDRP.ProductUnitTypeId) {
                  return {
                    ...row,
                    DRPused: proDRP,
                  };
                }
              }

              return row;
            });
          }
        });
      } catch (ex) {
        console.log("data err");
      }
      setTableData(_dataTable);
    }

    return () => {};
  }, [BillDetails, listKM]);

  useEffect(() => {
    setAllColumns([
      {
        title: "Mã sản phẩm",
        dataIndex: "productId",
        width: 200,
        render: (productId) => {
          return <Typography.Link>{productId}</Typography.Link>;
        },
      },

      {
        title: "Tên sản phẩm",
        dataIndex: "productName",
        width: 200,
        render: (productName, rowData) => {
          if (rowData.isSecondRow && MPused) {
            return <Typography.Link>{MPused.title}</Typography.Link>;
          }

          return productName;
        },
      },
      {
        title: "Mã đơn vị tính",
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
        align: "right",
        dataIndex: "price",
        render: (price, rowData) => {
          if (!rowData.isColNotData && rowData) {
            if (rowData.DRPused) {
              // khi có giảm giá trên sản phẩm
              return (
                <div className="price_discount_container">
                  <div className="price_before">
                    {convertToVND(rowData.price)}
                  </div>
                  <Tag color="green">-{rowData.DRPused.discountRate} %</Tag>
                  <div className="price_after">
                    {convertToVND(
                      rowData.price -
                        (rowData.price * rowData.DRPused.discountRate) / 100
                    )}
                  </div>
                </div>
              );
            } else {
              return convertToVND(rowData.price) || 0;
            }
          }
        },
      },
      {
        title: "Tổng",
        align: "right",
        render: (_, rowData) => {
          let discountOnBill = 0;
          let costBeforeDiscount = 0;
          if (!rowData.isColNotData && rowData) {
            let total = 0;
            if (rowData.DRPused) {
              total =
                (rowData.price -
                  (rowData.price * rowData.DRPused.discountRate) / 100) *
                rowData.quantity;
            } else {
              total = rowData.price * rowData.quantity;
            }

            return (
              <Typography.Title level={5} style={{ margin: 0, padding: 0 }}>
                {convertToVND(total)}
              </Typography.Title>
            );
          }

          // tính tổng trước khi giảm giá
          tableData.map((row) => {
            if (!row.isColNotData) {
              if (row.DRPused) {
                let price =
                  row.price - (row.price * row.DRPused.discountRate) / 100;
                costBeforeDiscount += price * row.quantity;
              } else {
                costBeforeDiscount += row.quantity * row.price;
              }
            }
          });

          // tính giảm trên bill
          if (MPused) {
            if (MPused.type == "discountRate") {
              let maxMoneyDiscount = MPused.maxMoneyDiscount;
              discountOnBill =
                costBeforeDiscount * (1 - MPused.discountRate / 100);
              if (discountOnBill > maxMoneyDiscount) {
                discountOnBill = maxMoneyDiscount;
              }
            }
            if (MPused.type == "discountMoney") {
              discountOnBill = MPused.discountMoney;
            }
          }

          // render
          if (rowData.isSecondRow) {
            return (
              <Typography.Title level={5} style={{ margin: 0, padding: 0 }}>
                {"-" + convertToVND(discountOnBill)}
              </Typography.Title>
            );
          }
          if (rowData.isFirstRow) {
            return (
              <Typography.Title level={4} style={{ margin: 0, padding: 0 }}>
                {convertToVND(costBeforeDiscount - discountOnBill)}
              </Typography.Title>
            );
          }
        },
      },
      {
        title: "",
        width: 52,
        align: "right",
        fixed: "right",
        render: (_, rowData) => {
          if (rowData) {
            if (rowData.isPromotion) {
              console.log(rowData.ProductPromotion);
              return (
                <Tag
                  color="green"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    dispatch(
                      setOpen({
                        name: "PromotionLineModal",
                        modalState: {
                          type: "view",
                          visible: true,
                          idSelected: rowData.ProductPromotion.id,
                          promotionHeaderId: rowData.PromotionHeaderId,
                        },
                      })
                    );
                  }}
                >
                  <GiftFilled />
                </Tag>
              );
            }

            if (rowData.isSecondRow && MPused) {
              return (
                <Tag
                  color="green"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    dispatch(
                      setOpen({
                        name: "PromotionLineModal",
                        modalState: {
                          type: "view",
                          visible: true,
                          idSelected: MPused.id,
                          promotionHeaderId: rowData.PromotionHeaderId,
                        },
                      })
                    );
                  }}
                >
                  <BulbOutlined />
                </Tag>
              );
            }

            if (rowData.DRPused) {
              return (
                <Tag
                  color="green"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    dispatch(
                      setOpen({
                        name: "PromotionLineModal",
                        modalState: {
                          type: "view",
                          visible: true,
                          idSelected: rowData.DRPused.id,
                          promotionHeaderId: rowData.PromotionHeaderId,
                        },
                      })
                    );
                  }}
                >
                  <BulbOutlined />
                </Tag>
              );
            }
          }
        },
      },
    ]);
    return () => {};
  }, [tableData]);

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
