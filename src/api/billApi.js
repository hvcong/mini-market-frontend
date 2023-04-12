import axiosClient from "./axiosClient";

class BillApi {
  addOne(formData) {
    let url = `bill/add`;
    return axiosClient.post(url, formData);
  }

  getLimitBill(page = 1, limit = 10) {
    let url = `bill/success?_page=${page}&_limit=${limit}`;
    return axiosClient.get(url);
  }

  getOneBillById(id) {
    let url = `bill/getId?id=${id}`;

    return axiosClient.get(url);
  }

  updateType(billId, type, employeeId) {
    let url = `bill/${billId}/update-type/${type}`;

    return axiosClient.put(url, {
      employeeId,
    });
  }

  //// receive bill
  getLimitReceives(page = 1, limit = 10) {
    let url = `retrieve/get?_page=${page}&_limit=${limit}`;
    return axiosClient.get(url);
  }

  addOneReceive(formData) {
    let url = `retrieve/add`;
    return axiosClient.post(url, formData);
  }

  //// order
  getLimitOrders(page = 1, limit = 10) {
    let url = `bill/fail?_page=${page}&_limit=${limit}`;
    return axiosClient.get(url);
  }
}

const billApi = new BillApi();
export default billApi;
