import { message } from "antd";
import storeApi from "../api/storeApi";
import productApi from "../api/productApi";

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
