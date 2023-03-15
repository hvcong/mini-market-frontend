import axiosClient from "./axiosClient";

class PriceHeaderApi {
  getMany(page, limit) {
    let url = `priceHeader/get?_page=1&_limit=10`;
    return axiosClient.get(url);
  }
}

const priceHeaderApi = new PriceHeaderApi();
export default priceHeaderApi;
