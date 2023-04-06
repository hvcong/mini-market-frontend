import {
  DeleteOutlined,
  FallOutlined,
  GifOutlined,
  GiftFilled,
  MoreOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import ListProductItem from "./ListProductItem";
import { useDispatch, useSelector } from "react-redux";
import {
  addOneProductToActiveTab,
  clearOneTab,
  removeOneProductLine,
} from "../../../store/slices/createBillSlice";
import { Button, Empty, message, Table, Tag, Typography } from "antd";
import promotionApi from "./../../../api/promotionApi";
import { compareDMY, convertToVND } from "./../../../utils/index";
import BillInfor from "./BillInfor";
import userApi from "../../../api/userApi";

const ListProduct = () => {
  const { activeKey, tabItems = [] } = useSelector(
    (state) => state.createBill.tabState
  );
  let customerPhone = "";
  let newPhoneInput = "";
  let isShowNewCustomer = false;
  tabItems.map((item) => {
    if (item.key == activeKey) {
      customerPhone = item.customerPhone;
      newPhoneInput = item.newPhoneInput;
      isShowNewCustomer = item.isShowNewCustomer;
    }
  });

  const list =
    useSelector((state) => state.createBill.listState[activeKey]) || [];
  const dispatch = useDispatch();
  const [customer, setCustomer] = useState({
    TypeCustomerId: "BT",
  });

  const [listPromotionLinesOnActive, setListPromotionLinesOnActive] = useState(
    []
  );

  const [allColumns, setAllColumns] = useState();
  const [tableData, setTableData] = useState([]);

  async function loadPromotionLinesActiveCanUsed() {
    let res = await promotionApi.getAllOnActive();
    let listLinePromotions = [];

    if (res.isSuccess) {
      let promotions = res.promotions || [];

      for (const promotion of promotions) {
        let start = new Date(promotion.startDate);
        let end = new Date(promotion.endDate);
        let now = new Date();
        let typeCustomers = promotion.TypeCustomers || [];
        let isCheckType = false;

        // kiểm tra khách hàng này có dược áp dụng hay không
        typeCustomers.map((type) => {
          if (type.id == customer.TypeCustomerId) {
            isCheckType = true;
          }
        });
        if (!isCheckType) {
          continue;
        }

        if (compareDMY(start, now) <= 0 && compareDMY(end, now) >= 0) {
          // những header đang sử dụng
          (promotion.ProductPromotions || []).map((linePP) => {
            let start2 = new Date(linePP.startDate);
            let end2 = new Date(linePP.endDate);
            let now = new Date();

            if (
              compareDMY(start2, now) <= 0 &&
              compareDMY(end2, now) >= 0 &&
              linePP.state
            ) {
              // những line khuyến mãi đang áp dụng
              listLinePromotions.push({
                ...linePP,
                promotionType: "PP",
              });
            }
          });

          (promotion.DiscountRateProducts || []).map((lineDRP) => {
            let start2 = new Date(lineDRP.startDate);
            let end2 = new Date(lineDRP.endDate);
            let now = new Date();

            if (
              compareDMY(start2, now) <= 0 &&
              compareDMY(end2, now) >= 0 &&
              lineDRP.state
            ) {
              // những line khuyến mãi đang áp dụng
              listLinePromotions.push({
                ...lineDRP,
                promotionType: "DRP",
              });
            }
          });

          (promotion.MoneyPromotions || []).map((lineMP) => {
            let start2 = new Date(lineMP.startDate);
            let end2 = new Date(lineMP.endDate);
            let now = new Date();

            if (
              compareDMY(start2, now) <= 0 &&
              compareDMY(end2, now) >= 0 &&
              lineMP.state
            ) {
              // những line khuyến mãi đang áp dụng
              listLinePromotions.push({
                ...lineMP,
                promotionType: "MP",
              });
            }
          });

          (promotion.Vouchers || []).map((lineV) => {
            let start2 = new Date(lineV.startDate);
            let end2 = new Date(lineV.endDate);
            let now = new Date();

            if (
              compareDMY(start2, now) <= 0 &&
              compareDMY(end2, now) >= 0 &&
              lineV.state
            ) {
              // những line khuyến mãi đang áp dụng
              listLinePromotions.push({
                ...lineV,
                promotionType: "V",
              });
            }
          });
        }
      }
    }

    setListPromotionLinesOnActive(listLinePromotions);
  }

  useEffect(() => {
    if (isShowNewCustomer && newPhoneInput) {
      setCustomer({
        TypeCustomerId: "BT",
      });
    } else {
      loadCustomerByPhone(customerPhone);
    }

    return () => {};
  }, [customerPhone, isShowNewCustomer, newPhoneInput]);

  async function loadCustomerByPhone(phone) {
    let res = await userApi.getOneCustomerByPhone(phone);
    if (res.isSuccess) {
      setCustomer({
        TypeCustomerId: "BT",
        ...res.customer,
      });
    } else {
      setCustomer({
        TypeCustomerId: "BT",
      });
    }
  }

  useEffect(() => {
    loadPromotionLinesActiveCanUsed();

    return () => {};
  }, [customer]);

  useEffect(() => {
    let _tableData = [];

    // first row for calculate
    _tableData.push({ isFirstRow: true });

    _tableData.push(...list);

    listPromotionLinesOnActive.map((promotionLine) => {
      // PP promotion
      if (promotionLine.promotionType == "PP") {
        let put1 = promotionLine.ProductUnitType;
        let put2 = promotionLine.GiftProduct.ProductUnitType;

        list.map((priceLine) => {
          let put3 = priceLine.ProductUnitType;

          if (put3.id == put1.id) {
            let step = promotionLine.minQuantity;
            let quantity = priceLine.quantity;

            let giftQuantity = (quantity - (quantity % step)) / step;
            if (giftQuantity > 0) {
              _tableData.push({
                isPromotion: true,
                ProductUnitType: put2,
                quantity: giftQuantity * promotionLine.GiftProduct.quantity,
                price: 0,
                ProductPromotionId: promotionLine.id,
              });
            }
          }
        });
      }

      // DRP
      if (promotionLine.promotionType == "DRP") {
        let put1 = promotionLine.ProductUnitType;
        list.map((priceLine) => {
          let put3 = priceLine.ProductUnitType;
          if (put1.id == put3.id) {
            _tableData = _tableData.map((rowData) => {
              if (rowData.ProductUnitTypeId == put3.id) {
                return {
                  ...rowData,
                  DRPused: promotionLine,
                };
              }
              return rowData;
            });
          }
        });
      }
    });

    setTableData(_tableData);

    setAllColumns([
      {
        title: "",
        width: 22,
        render: (_, rowData, index) => {
          if (!rowData.isFirstRow) {
            return (
              <Button
                size="small"
                icon={<DeleteOutlined />}
                danger
                disabled={rowData.isPromotion}
                onClick={() => {
                  if (rowData && rowData.id)
                    dispatch(removeOneProductLine(rowData.id));
                }}
              />
            );
          }
        },
      },
      {
        title: "Mã sản phẩm",
        render: (_, rowData) => {
          if (!rowData.isFirstRow && rowData && rowData.ProductUnitType) {
            return rowData.ProductUnitType.ProductId;
          }
        },
      },
      {
        title: "Tên sản phẩm",
        render: (_, rowData) => {
          if (!rowData.isFirstRow && rowData && rowData.ProductUnitType) {
            return rowData.ProductUnitType.Product.name;
          }
        },
      },
      {
        title: "ĐVT",
        render: (_, rowData) => {
          if (!rowData.isFirstRow && rowData && rowData.ProductUnitType) {
            return rowData.ProductUnitType.UnitTypeId;
          }
        },
      },
      {
        title: "Đơn giá",
        align: "right",
        render: (_, rowData) => {
          if (!rowData.isFirstRow && rowData) {
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
        title: "Số lượng",
        align: "right",
        render: (_, rowData) => {
          if (!rowData.isFirstRow && rowData) {
            return rowData.quantity;
          }
        },
      },
      {
        title: "Tổng",
        align: "right",
        render: (_, rowData) => {
          if (!rowData.isFirstRow && rowData) {
            let total = 0;
            if (rowData.DRPused) {
              total =
                (rowData.price -
                  (rowData.price * rowData.DRPused.discountRate) / 100) *
                rowData.quantity;
            } else {
              total = rowData.price * rowData.quantity;
            }

            return convertToVND(total);
          }

          // tổng cuối cùng
          if (rowData.isFirstRow) {
            let total = 0;
            _tableData.map((row) => {
              if (!row.isFirstRow) {
                if (row.DRPused) {
                  let price =
                    row.price - (row.price * row.DRPused.discountRate) / 100;
                  total += price * row.quantity;
                } else {
                  total += row.quantity * row.price;
                }
              }
            });
            return (
              <Typography.Title level={4} style={{ margin: 0, padding: 0 }}>
                {convertToVND(total)}
              </Typography.Title>
            );
          }
        },
      },
      {
        title: "",
        width: 32,
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            if (rowData.isPromotion) {
              return (
                <Tag color="green">
                  <GiftFilled />
                </Tag>
              );
            }
          }
        },
      },
    ]);

    return () => {};
  }, [list, listPromotionLinesOnActive]);

  useEffect(() => {
    return () => {
      dispatch(clearOneTab());
    };
  }, []);

  return (
    <div className="list_product">
      <Table
        columns={allColumns}
        size="small"
        dataSource={tableData}
        pagination={false}
        className="table"
      />
      <div className="bill_infor_container">
        <BillInfor
          tableData={tableData}
          listPromotionLinesOnActive={listPromotionLinesOnActive}
        />
      </div>
    </div>
  );
};

export default ListProduct;
