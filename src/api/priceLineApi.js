import axiosClient from "./axiosClient";

class PriceLineApi {
  getByHeaderId(headerId) {
    let url = `price/getPriceHeader?priceHeaderId=${headerId}`;
    return axiosClient.get(url);
  }

  getOneBy_PUT_id(id) {
    let url = `price/proUnitId?productUnitTypeId=${id}`;
    return axiosClient.get(url);
  }
}

const priceLineApi = new PriceLineApi();
export default priceLineApi;
