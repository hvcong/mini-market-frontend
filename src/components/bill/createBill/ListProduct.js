import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  FallOutlined,
  GifOutlined,
  GiftFilled,
  MoreOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addOneProductToActiveTab,
  clearOneTab,
  removeOneProductLine,
  updateQuantityOneProduct,
} from "../../../store/slices/createBillSlice";
import {
  Button,
  Empty,
  InputNumber,
  message,
  Popover,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import promotionApi from "./../../../api/promotionApi";
import { compareDMY, convertToVND } from "./../../../utils/index";
import BillInfor from "./BillInfor";
import userApi from "../../../api/userApi";
import productApi from "../../../api/productApi";
import PPToltip from "./PPPopover";
import PPPopover from "./PPPopover";

const ListProduct = () => {
  const { activeKey, tabItems = [] } = useSelector(
    (state) => state.createBill.tabState
  );
  let customerPhone = "";
  tabItems.map((item) => {
    if (item.key == activeKey) {
      customerPhone = item.customerPhone || "0";
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
  const [costBeforeDiscountVoucher, setCostBeforeDiscountVoucher] = useState(0);
  const [discountMoneyByMoneyPromotion, setDiscountMoneyByMoneyPromotion] =
    useState(0);
  const [MPused, setMPused] = useState(null);

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
    loadCustomerByPhone(customerPhone);

    return () => {};
  }, [customerPhone]);

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
    loadDataToTable();
    return () => {};
  }, [list, listPromotionLinesOnActive]);

  async function loadDataToTable() {
    let _tableData = [];

    _tableData.push(...list);

    // tính toán số lượng tồn kho còn lại
    let _quantityStore = {
      // productId:{
      //   totalQuantity:"",
      //   quantityOnBill:""
      // }
    };

    _tableData.map((rowData) => {
      let productId = rowData.ProductUnitType.Product.id;
      _quantityStore[productId] = {
        totalQuantity: 0,
        quantityOnBill: 0,
      };
    });

    _tableData.map((rowData) => {
      if (!rowData.isRowNotData) {
        let quantity = rowData.quantity;
        let productId = rowData.ProductUnitType.Product.id;
        let totalQuantity = rowData.ProductUnitType.Product.quantity;
        let convertionQuantity =
          rowData.ProductUnitType.UnitType.convertionQuantity;
        _quantityStore[productId].totalQuantity = totalQuantity;
        _quantityStore[productId].quantityOnBill +=
          quantity * convertionQuantity;
      }
    });

    let listPPs = [];
    const maxAvailabe = {
      // productId:"0"
    };

    // tính toán khuyến mãi
    for (const promotionLine of listPromotionLinesOnActive) {
      // PP promotion
      if (promotionLine.promotionType == "PP") {
        let putGift = promotionLine.GiftProduct.ProductUnitType;
        let convertionQuantityGift = putGift.UnitType.convertionQuantity;

        listPPs.push({
          ...promotionLine,
          convertionQuantityGift,
        });
      }

      // DRP
      if (promotionLine.promotionType == "DRP") {
        let put1 = promotionLine.ProductUnitType;
        for (const priceLine of list) {
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
        }
      }
    }
    // sắp xếp theo thứ tự ưu tiên, (đơn vị càng lớn thì được tặng trước)
    listPPs.sort((a, b) => {
      return b.convertionQuantityGift - a.convertionQuantityGift;
    });

    listPPs.map((promotionLine) => {
      let putGift = promotionLine.GiftProduct.ProductUnitType;
      let convertionQuantityGift = putGift.UnitType.convertionQuantity;
      let put1 = promotionLine.ProductUnitType;

      for (const priceLine of list) {
        let put3 = priceLine.ProductUnitType;

        if (put3.id == put1.id) {
          let minQuantity = promotionLine.minQuantity;
          let quantityBuy = priceLine.quantity;
          let step = Math.floor(quantityBuy / minQuantity);

          /**
           * Tính số lượng tồn kho xem có đủ để km không?
           * Số lượng tồn theo đơn vị cơ bản của sp tặng là = tồn kho - số lượng nó trong đơn hàng hiện tại
           * - nếu đủ số lượng thì sẽ được hưởng tất cả,nếu không đủ thì hưởng tùy theo số lượng tồn
           */

          let totalQuantityOfGiftProduct = putGift.Product.quantity;
          let totalOnBillOfGiftProduct =
            (_quantityStore[putGift.ProductId] &&
              _quantityStore[putGift.ProductId].quantityOnBill) ||
            0;

          if (
            !maxAvailabe[putGift.ProductId] &&
            maxAvailabe[putGift.ProductId] != 0
          ) {
            maxAvailabe[putGift.ProductId] =
              totalQuantityOfGiftProduct - totalOnBillOfGiftProduct;
          }

          let tmpQuantityGift = step * promotionLine.GiftProduct.quantity;

          // số lượng sẽ tặng
          let availabeQuantityGift = Math.floor(
            maxAvailabe[putGift.ProductId] / convertionQuantityGift
          );

          let quantityGiftOke = tmpQuantityGift;
          let message = "";
          if (tmpQuantityGift > availabeQuantityGift) {
            quantityGiftOke = availabeQuantityGift;
            if (quantityGiftOke == 0) {
              message = "Không áp dụng khuyến mãi do không đủ số lượng!";
            } else {
              message = "Chỉ áp dụng một phần, do không đủ số lượng!";
            }
          }

          if (step > 0) {
            maxAvailabe[putGift.ProductId] =
              maxAvailabe[putGift.ProductId] -
              quantityGiftOke * convertionQuantityGift;
            _tableData.push({
              isPromotion: true,
              ProductUnitType: putGift,
              quantity: quantityGiftOke,
              message: message,
              price: 0,
              ProductPromotionId: promotionLine.id,
              ProductPromotion: promotionLine,
              productIdGift: putGift.ProductId,
              convertionQuantityGift: convertionQuantityGift,
            });
          }
        }
      }
    });

    let subTotal = 0;
    _tableData.map((row) => {
      if (!row.isRowNotData) {
        if (row.DRPused) {
          let price = row.price - (row.price * row.DRPused.discountRate) / 100;
          subTotal += price * row.quantity;
        } else {
          subTotal += row.quantity * row.price;
        }
      }
    });
    let discountOnBill = 0;
    let _MPused = null;

    listPromotionLinesOnActive.map((promotionLine) => {
      if (promotionLine.promotionType == "MP") {
        let minCost = promotionLine.minCost;
        let type = promotionLine.type;
        let discountMoney = promotionLine.discountMoney;
        let discountRate = promotionLine.discountRate;
        let maxMoneyDiscount = promotionLine.maxMoneyDiscount;
        let availableBudget = promotionLine.availableBudget;

        if (minCost <= subTotal) {
          // giảm bằng tiền
          if (type == "discountMoney") {
            // lấy cái giảm giá nhiều nhát
            if (discountMoney <= availableBudget) {
              if (discountMoney > discountOnBill) {
                _MPused = promotionLine;
                discountOnBill = discountMoney;
              }
            }
          }

          // giảm bằng %
          if (type == "discountRate") {
            let sum = discountRate * subTotal;
            if (sum > maxMoneyDiscount) {
              sum = maxMoneyDiscount;
            }

            // lấy cái giảm giá nhiều nhát
            if (sum <= availableBudget) {
              if (sum > discountOnBill) {
                discountOnBill = sum;
                _MPused = promotionLine;
              }
            }
          }
        }
      }
    });

    if (_MPused) {
      _tableData.unshift({
        isSecondRow: true,
        isRowNotData: true,
        discountOnBill,
        MPused: _MPused,
      });
    }

    // first row for calculate
    _tableData.unshift({ isFirstRow: true, isRowNotData: true });

    setTableData(_tableData);
    setCostBeforeDiscountVoucher(subTotal - discountOnBill);
    setDiscountMoneyByMoneyPromotion(discountOnBill);
    setMPused(_MPused);

    setAllColumns([
      {
        title: "",
        width: 22,
        render: (_, rowData, index) => {
          if (!rowData.isRowNotData) {
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
          if (!rowData.isRowNotData && rowData && rowData.ProductUnitType) {
            return rowData.ProductUnitType.ProductId;
          }
        },
      },
      {
        title: "Tên sản phẩm",
        render: (_, rowData) => {
          if (!rowData.isRowNotData && rowData && rowData.ProductUnitType) {
            return rowData.ProductUnitType.Product.name;
          }

          if (rowData.isSecondRow) {
            console.log(rowData);
            return rowData.MPused.title;
          }
        },
      },
      {
        title: "ĐVT",
        render: (_, rowData) => {
          if (!rowData.isRowNotData && rowData && rowData.ProductUnitType) {
            return rowData.ProductUnitType.UnitTypeId;
          }
        },
      },
      {
        title: "Đơn giá",
        align: "right",
        render: (_, rowData) => {
          if (!rowData.isRowNotData && rowData) {
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
        render: (_, rowData) => {
          if (
            !rowData.isRowNotData &&
            rowData.ProductUnitType &&
            !rowData.isPromotion
          ) {
            let convertionQuantity =
              rowData.ProductUnitType.UnitType.convertionQuantity;
            let productId = rowData.ProductUnitType.ProductId;
            let totalQuantity = _quantityStore[productId].totalQuantity;
            let quantityOnBill = _quantityStore[productId].quantityOnBill;
            let quantity = rowData.quantity * convertionQuantity;
            let maxQuantityAvailabe = Math.floor(
              (totalQuantity - quantityOnBill + quantity) / convertionQuantity
            );

            return (
              <Tooltip
                placement="topLeft"
                title={`Số lượng tối đa có thể: ${maxQuantityAvailabe}`}
              >
                <div>
                  <InputNumber
                    min={1}
                    value={rowData.quantity}
                    type="number"
                    onChange={(value) => {
                      handleChangeQuantity(value, rowData, maxQuantityAvailabe);
                    }}
                  />
                </div>
              </Tooltip>
            );
          }

          if (!rowData.isRowNotData) {
            return (
              <div
                style={{
                  paddingLeft: 10,
                }}
              >
                {rowData.quantity || 0}
              </div>
            );
          }
        },
      },
      {
        title: "Tổng",
        align: "right",
        render: (_, rowData) => {
          if (!rowData.isRowNotData && rowData) {
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

          if (rowData.isSecondRow) {
            return convertToVND(-discountOnBill);
          }

          // tổng cuối cùng
          if (rowData.isFirstRow) {
            let sum = subTotal - discountOnBill;

            return (
              <Typography.Title level={4} style={{ margin: 0, padding: 0 }}>
                {convertToVND(sum)}
              </Typography.Title>
            );
          }
        },
      },
      {
        title: "",
        width: 32,
        render: (_, rowData) => {
          if (rowData.isPromotion || rowData.isSecondRow) {
            return (
              <Popover
                content={<PPPopover rowData={rowData} />}
                trigger="hover"
              >
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <Tag color="green">
                    <GiftFilled />
                  </Tag>
                  {rowData.message && (
                    <WarningOutlined style={{ color: "yellow" }} />
                  )}
                </div>
              </Popover>
            );
          }
        },
      },
    ]);
  }

  useEffect(() => {
    return () => {
      dispatch(clearOneTab());
    };
  }, []);

  function handleChangeQuantity(quantity, rowData, maxQuantityAvailabe) {
    if (quantity <= 0) {
      message.warning("Số lượng phải lớn hơn 0");

      dispatch(
        updateQuantityOneProduct({
          id: rowData.id,
          quantity: 1,
        })
      );
      return;
    }

    if (quantity > 0) {
      if (quantity > maxQuantityAvailabe) {
        message.warning("Số lượng tồn kho không đủ!");
        quantity = maxQuantityAvailabe;
      }

      dispatch(
        updateQuantityOneProduct({
          id: rowData.id,
          quantity: quantity,
        })
      );
    }
  }

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
          customer={customer}
          costBeforeDiscountVoucher={costBeforeDiscountVoucher}
          discountMoneyByMoneyPromotion={discountMoneyByMoneyPromotion}
          MPused={MPused}
        />
      </div>
    </div>
  );
};

export default ListProduct;
