import { message } from "antd";
import storeApi from "../api/storeApi";
import productApi from "../api/productApi";
import billApi from "../api/billApi";
import promotionApi from "../api/promotionApi";
import { useDispatch } from "react-redux";

class HandleAfter {
  async createInputTicket(inputId) {
    let res = await storeApi.getOneInputById(inputId);
    if (res.isSuccess) {
      let input = res.input || {};
      let inputDetails = input.InputDetails || [];

      let data = [];

      for (const inputDetail of inputDetails) {
        data.push({
          quantity: inputDetail.quantity,
          ProductUnitTypeId: inputDetail.ProductUnitTypeId,
          type: "Nhập kho",
          employeeId: input.EmployeeId,
        });
      }

      //create storeTran
      let formData = {
        data: data,
      };
      res = await storeApi.addMany(formData);
    }
  }

  async createWareHouseTicket(ticketId) {
    let res = await storeApi.getOneTicketById(ticketId);
    if (res.isSuccess) {
      let ticket = res.ticket;
      let ticketDetails = ticket.TicketDetails || [];
      let data = [];

      for (const ticketDetail of ticketDetails) {
        // số lượng thay biến động theo đơn vị báo cáo
        let quantity = ticketDetail.realReportQty - ticketDetail.reportQty;
        // số lượng biến động theo đơn vị cơ bản
        let basePutId = await getOneBasePutIdByProductId(
          ticketDetail.ProductUnitType.ProductId
        );
        let baseQuantity =
          ticketDetail.realBaseQty - ticketDetail.reportQtyBase;

        if (quantity != 0) {
          data.push({
            quantity: quantity,
            ProductUnitTypeId: ticketDetail.ProductUnitTypeId,
            type: "Kiểm kho",
            employeeId: ticket.EmployeeId,
          });
        }

        if (baseQuantity != 0) {
          data.push({
            quantity: baseQuantity,
            ProductUnitTypeId: basePutId,
            type: "Kiểm kho",
            employeeId: ticket.EmployeeId,
          });
        }
      }

      //   create storeTran
      let formData = {
        data: data,
      };
      res = await storeApi.addMany(formData);
    }
  }

  async handleStoreTranAfterCreateBill(
    billId,
    tableData,
    MPused,
    voucherUsed,
    discountMoneyByMoneyPromotion,
    discountMoneyByVoucher
  ) {
    let res = await billApi.getOneBillById(billId);
    let bill = res.bill || {};
    let billDetails = bill.BillDetails || [];
    let employeeId = bill.EmployeeId;

    let storeTrans = [];

    billDetails.map((billDetail) => {
      storeTrans.push({
        quantity: -billDetail.quantity,
        ProductUnitTypeId: billDetail.Price.ProductUnitTypeId,
        type: "Bán hàng",
        employeeId: employeeId,
      });
    });

    // tạo promotion result, và xử lí kho sau khi áp dụng khuyến mãi
    for (const row of tableData) {
      /// PP result
      if (row.isPromotion && row.ProductPromotionId) {
        let quantityApplied = row.quantity;

        if (quantityApplied > 0) {
          let res = await promotionApi.addResult({
            isSuccess: true,
            note: row.message || "Được khuyến mãi khi mua hàng",
            BillId: billId,
            ProductPromotionId: row.ProductPromotionId,
            quantityApplied,
          });

          if (res.isSuccess) {
            storeTrans.push({
              quantity: -quantityApplied,
              ProductUnitTypeId: row.ProductUnitType.id,
              type: "Khuyến mãi bán hàng",
              employeeId: employeeId,
            });
          }
        }
      }

      if (row.DRPused) {
        await promotionApi.addResult({
          isSuccess: true,
          note: "Được khuyến mãi khi mua hàng",
          BillId: billId,
          DiscountRateProductId: row.DRPused.id,
        });
      }
    }

    if (MPused) {
      let res = await promotionApi.addResult({
        isSuccess: true,
        note: "Được khuyến mãi khi mua hàng",
        BillId: billId,
        MoneyPromotionId: MPused.id,
        discountMoneyByMoneyPromotion,
      });

      if (res.isSuccess) {
        // trừ vào ngân sách còn lại của km
        await promotionApi.updateOneMP(MPused.id, {
          availableBudget:
            MPused.availableBudget - discountMoneyByMoneyPromotion,
        });
      }
    }

    if (voucherUsed) {
      await promotionApi.addResult({
        isSuccess: true,
        note: "Được khuyến mãi khi mua hàng",
        BillId: billId,
        VoucherId: voucherUsed.id,
        discountMoneyByVoucher,
      });
    }

    // create store
    await storeApi.addMany({
      data: storeTrans,
    });
  }

  // async handleAfterCancelOrder(billId) {
  //   let res = await billApi.getOneBillById(billId);
  //   let bill = res.bill || {};
  //   let billDetails = bill.BillDetails || [];
  //   let employeeId = bill.EmployeeId;

  //   let storeTrans = [];

  //   billDetails.map((billDetail) => {
  //     storeTrans.push({
  //       quantity: billDetail.quantity,
  //       ProductUnitTypeId: billDetail.Price.ProductUnitTypeId,
  //       type: "Hủy đơn hàng",
  //       employeeId: employeeId,
  //     });
  //   });

  //   // tạo store của khuyến mãi

  //   let promotionResults = bill.PromotionResults || [];

  //   promotionResults.map((result) => {
  //     if (result.isSuccess) {
  //       let ProductPromotion = result.ProductPromotion;

  //       if (ProductPromotion) {
  //         let putIdGift = ProductPromotion.GiftProduct.ProductUnitTypeId;
  //         let quantityApplied = result.quantityApplied;

  //         storeTrans.push({
  //           quantity: quantityApplied,
  //           ProductUnitTypeId: putIdGift,
  //           type: "Hủy đơn hàng",
  //           employeeId: employeeId,
  //         });
  //       }
  //     }
  //   });
  //   // create store
  //   storeApi.addMany({
  //     data: storeTrans,
  //   });
  // }
}

async function getOneBasePutIdByProductId(productId) {
  let res = await productApi.findOneById(productId);
  let putId = "";
  if (res.isSuccess) {
    let product = res.product;
    let ProductUnitTypes = product.ProductUnitTypes || [];
    ProductUnitTypes.map((put) => {
      if (put.UnitType.convertionQuantity == 1) {
        putId = put.id;
      }
    });
  }
  return putId;
}

const handleAfter = new HandleAfter();
export default handleAfter;
