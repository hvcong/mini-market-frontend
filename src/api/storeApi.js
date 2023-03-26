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

  // ticket store
  getLimitTiket(page = 1, limit = 10) {
    let url = `ticket/get?_page=${page}&_limit=${limit}`;
    return axiosClient.get(url);
  }

  addTiket(formData) {
    let url = `ticket/add`;
    return axiosClient.post(url, formData);
  }

  getOneTicketById(id) {
    let url = `ticket/one?id=${id}`;
    return axiosClient.get(url);
  }
}

const storeApi = new StoreApi();
export default storeApi;
