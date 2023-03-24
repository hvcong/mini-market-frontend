import axiosClient from "./axiosClient";

class BillApi {
  addOne(formData) {
    let url = `bill/add`;
    return axiosClient.post(url, formData);
  }

  getLimitBill(page = 1, limit = 10) {
    let url = `bill/get?_page=${page}&limit=${limit}`;
    return axiosClient.get(url);
  }
}

const billApi = new BillApi();
export default billApi;
