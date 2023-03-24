import axiosClient from "./axiosClient";

class BillApi {
  addOne(formData) {
    let url = `bill/add`;
    return axiosClient.post(url, formData);
  }

  getLimitBill(page = 1, limit = 10) {
    let url = `bill/success?_page=${page}&limit=${limit}`;
    return axiosClient.get(url);
  }

  getOneBillById(id) {
    let url = `bill/getId?id=${id}`;
    return axiosClient.get(url);
  }

  //// receive bill
  getLimitReceives(page = 1, limit = 10) {
    let url = `retrieve/get?_page=${page}&limit=${limit}`;
    return axiosClient.get(url);
  }

  addOneReceive(formData) {
    let url = `retrieve/add`;
    return axiosClient.post(url, formData);
  }
}

const billApi = new BillApi();
export default billApi;
