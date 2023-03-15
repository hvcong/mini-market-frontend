import axiosClient from "./axiosClient";

class PriceLineApi {
  getByHeaderId(headerId) {
    let url = `price/getPriceHeader?priceHeaderId=${headerId}`;
    return axiosClient.get(url);
  }
}

const priceLineApi = new PriceLineApi();
export default priceLineApi;
