import axiosClient from "./axiosClient";

class BillApi {
  addOne(formData) {
    let url = `bill/add`;
    return axiosClient.post(url, formData);
  }
}

const billApi = new BillApi();
export default billApi;
