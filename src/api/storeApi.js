import axiosClient from "./axiosClient";

class StoreApi {
  addMany(formData) {
    let url = "store/addMany";
    return axiosClient.post(url, formData);
  }

  getLimitStoreTransactions(page = 1, limit = 10) {
    let url = `store/get?_page=${page}&_limit=${limit}`;
    return axiosClient.get(url);
  }
}

const storeApi = new StoreApi();
export default storeApi;
