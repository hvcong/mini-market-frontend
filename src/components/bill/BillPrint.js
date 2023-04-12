import { Button, Select, Table, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import ModalCustomer from "../ModalCustomer";
import "../../assets/styles/billPrint.scss";
import billApi from "../../api/billApi";
import { useDispatch, useSelector } from "react-redux";
import { render } from "@testing-library/react";
import { setOpen } from "../../store/slices/modalSlice";
import { GiftFilled } from "@ant-design/icons";
import { convertToVND, sqlToHHmmDDmmYYYY } from "../../utils";

const BillPrint = () => {
  const [bill, setBill] = useState(null);
  const modalState = useSelector(
    (state) => state.modal.modals["BillPrintModal"]
  );

  const billId = modalState.idSelected;
  const [amountMoney, setAmountMoney] = useState({
    discountMoneyByVoucher: 0,
    discountMoneyByMoneyPromotion: 0,
  });
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [allColumns, setAllColumns] = useState([
    {
      title: "Tên SP",
      dataIndex: "name",
      render: (name, rowData) => {
        if (rowData.isTitle) {
          return (
            <div
              style={{
                fontWeight: "bold",
              }}
            >
              {name}
            </div>
          );
        }
        if (rowData.isGift) {
          return (
            <>
              <GiftFilled /> {name}
            </>
          );
        }
        return name;
      },
    },
    {
      title: "ĐVT",
      render: (_, rowData) => {
        if (rowData.put) {
          return rowData.put.UnitType.name;
        }
      },
    },
    {
      title: "SL",
      dataIndex: "quantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      align: "right",
      render: (price, rowData) => {
        if (rowData.DRPused) {
          return (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  fontSize: 10,
                }}
              >
                <div
                  className="price_before"
                  style={{
                    fontSize: 10,
                  }}
                >
                  {convertToVND(rowData.price)}
                </div>
                <div color="green">-{rowData.DRPused.discountRate} %</div>
              </div>
              <div className="">
                {convertToVND(
                  rowData.price -
                    (rowData.price * rowData.DRPused.discountRate) / 100
                )}
              </div>
            </div>
          );
        }
        if (!rowData.isColNotData) {
          return convertToVND(price);
        }
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "sum",
      align: "right",
      render: (sum, rowData) => {
        if (!rowData.isColNotData) {
          if (rowData.DRPused) {
            let total = (sum * (100 - rowData.DRPused.discountRate)) / 100;
            return convertToVND(total);
          }

          return convertToVND(sum);
        }
      },
    },
  ]);

  useEffect(() => {
    if (billId) {
      loadBill();
    }
    return () => {};
  }, [billId]);

  useEffect(() => {
    if (bill) {
      let listKM = [];
      let isAddPromotionTitleRow = false;

      let _dataTable = [];

      bill.BillDetails.map((billDetail) => {
        _dataTable.push({
          name: billDetail.Price.ProductUnitType.Product.name,
          quantity: billDetail.quantity,
          put: billDetail.Price.ProductUnitType,
          price: billDetail.Price.price,
          sum: billDetail.quantity * billDetail.Price.price,
        });
      });

      if (bill.PromotionResults) {
        listKM = bill.PromotionResults.map((result) => {
          if (result.ProductPromotionId) {
            return {
              ...result,
              type: "PP",
            };
            isAddPromotionTitleRow = true;
          }
          if (result.MoneyPromotion) {
            return {
              ...result,
              type: "MP",
            };
            isAddPromotionTitleRow = true;
          }
          if (result.DiscountRateProduct) {
            return {
              ...result,
              type: "DRP",
            };
          }
          if (result.Voucher) {
            return {
              ...result,
              type: "V",
            };
          }
        }).filter((item) => item.id);
      }

      if (isAddPromotionTitleRow) {
        _dataTable.push({
          isColNotData: true,
          name: "Các khuyến mãi",
          isTitle: true,
        });
      }

      listKM.map((result) => {
        let isSuccess = result.isSuccess;
        let type = result.type;

        // PP
        if (isSuccess && type == "PP") {
          let ProductPromotion = result.ProductPromotion;
          let putGift = ProductPromotion.GiftProduct.ProductUnitType;
          let quantityApplied = result.quantityApplied;

          let newRow = {
            quantity: quantityApplied,
            price: 0,
            sum: 0,
            name: putGift.Product.name,
            put: putGift,
            isGift: true,
            PPused: ProductPromotion,
          };
          _dataTable.push(newRow);
        }

        // MP
        if (isSuccess && type == "MP") {
          _dataTable.push({
            MPused: result.MoneyPromotion,
            name: result.MoneyPromotion.title,
            quantity: 1,
            sum: -result.discountMoneyByMoneyPromotion,
            isGift: true,
          });
          setAmountMoney({
            ...amountMoney,
            discountMoneyByMoneyPromotion: result.discountMoneyByMoneyPromotion,
          });
        }
        // DRP
        if (isSuccess && type == "DRP") {
          let proDRP = result.DiscountRateProduct;
          console.log(proDRP);

          _dataTable = _dataTable.map((row) => {
            if (row.put && !row.PPused) {
              if (row.put.id == proDRP.ProductUnitTypeId) {
                return {
                  ...row,
                  DRPused: proDRP,
                };
              }
            }

            return row;
          });
        }

        // V
        if (isSuccess && type == "V") {
          setAmountMoney({
            ...amountMoney,
            discountMoneyByVoucher: result.discountMoneyByVoucher,
          });
        }
      });

      setTableData(_dataTable);
    }
    return () => {};
  }, [bill]);

  async function loadBill() {
    let res = await billApi.getOneBillById(billId);
    if (res.isSuccess) {
      setBill(res.bill);
    }
  }

  const componentRef = useRef();
  if (!bill) {
    return null;
  }

  let firstName =
    (bill.Customer.firstName && bill.Customer.firstName + " ") || " ";
  let lastName =
    (bill.Customer.lastName && bill.Customer.lastName + " ") || " ";
  let name = firstName + lastName;
  if (name) {
    name = name.trim();
  }
  if (!name) {
    name = bill.Customer.phonenumber;
  }

  return (
    <ModalCustomer
      visible={modalState.visible}
      style={{
        width: 500,
        padding: 0,
      }}
      className="bill_print_modal_container"
    >
      <div className="bill_print_modal">
        <div ref={componentRef} className="bill_print_content">
          <div className="bill_print_company">ECO MARKET</div>
          <div className="bill_print_address">
            29/8/7 đường 15, Hiệp Bình Chánh, Thủ Đức
          </div>
          <div className="bill_print_title">Hóa đơn bán hàng</div>
          <div className="bill_print_infor">
            <div className="bill_print_infor_item">
              <div className="bill_print_infor_item_label">Mã hóa đơn</div>
              <div className="bill_print_infor_item_value">{bill.id}</div>
            </div>
            <div className="bill_print_infor_item">
              <div className="bill_print_infor_item_label">Thời gian</div>
              <div className="bill_print_infor_item_value">
                {sqlToHHmmDDmmYYYY(bill.orderDate)}
              </div>
            </div>
            <div className="bill_print_infor_item">
              <div className="bill_print_infor_item_label">
                Nhân viên bán hàng
              </div>
              <div className="bill_print_infor_item_value">
                {bill.Employee.name}
              </div>
            </div>
            <div className="bill_print_infor_item">
              <div className="bill_print_infor_item_label"> Tên khách hàng</div>
              <div className="bill_print_infor_item_value">{name}</div>
            </div>
          </div>

          <div className="bill_print_table">
            <Table
              columns={allColumns.filter((col) => !col.hidden)}
              dataSource={tableData}
              pagination={false}
              size="small"
            />
          </div>
          <div className="bill_print_sum">
            <div className="bill_print_sum_item">
              <div className="bill_print_sum_label">T.Cộng</div>
              <div className="bill_print_sum_value">
                {convertToVND(bill.cost + amountMoney.discountMoneyByVoucher)}
              </div>
            </div>
            <div className="bill_print_sum_item">
              <div className="bill_print_sum_label">Phiếu giảm giá</div>
              <div className="bill_print_sum_value">
                {convertToVND(-amountMoney.discountMoneyByVoucher)}
              </div>
            </div>
            <div className="bill_print_sum_item">
              <div
                className="bill_print_sum_label"
                style={{
                  fontSize: 20,
                }}
              >
                TỔNG TIỀN THU
              </div>
              <div
                className="bill_print_sum_value"
                style={{
                  fontSize: 20,
                }}
              >
                {convertToVND(bill.cost)}
              </div>
            </div>
          </div>
          <div className="bill_print_footer">Xin cám ơn và hẹn gặp lại</div>
        </div>
        <div className="bill_print_btns">
          <ReactToPrint
            className="bill_print_btn"
            trigger={() => <Button type="primary">In hóa đơn</Button>}
            content={() => componentRef.current}
          />
          <div className="bill_print_btn">
            <Button
              danger
              onClick={() => {
                dispatch(
                  setOpen({
                    name: "BillPrintModal",
                    modalState: {
                      visible: false,
                    },
                  })
                );
              }}
            >
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </ModalCustomer>
  );
};

export default BillPrint;
