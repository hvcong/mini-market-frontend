import axiosClient from "./axiosClient";

class PromotionApi {
  addOneHeader(formData) {
    let url = `promotion/add`;
    return axiosClient.post(url, formData);
  }

  getLimitHeader(page = 1, limit = 10) {
    let url = `promotion/get?_page=${page}&_limit=${limit}`;
    return axiosClient.get(url);
  }
  getOneHeaderById(id) {
    let url = `promotion/getId?id=${id}`;
    return axiosClient.get(url);
  }

  updateOneHeader(id, formData) {
    let url = `promotion/update?id=${id}`;
    return axiosClient.put(url, formData);
  }

  getAllOnActive() {
    let url = `promotion/getAll/active`;
    return axiosClient.get(url);
  }

  // line PP
  addOnePP(formData) {
    let url = `productPromotion/add`;
    return axiosClient.post(url, formData);
  }

  getOnePPById(id) {
    let url = `productPromotion/getId?id=${id}`;
    return axiosClient.get(url);
  }

  updateOnePP(id, formData) {
    let url = `productPromotion/update?id=${id}`;
    return axiosClient.put(url, formData);
  }

  // line DRP
  addOneDRP(formData) {
    let url = `discount/add`;
    return axiosClient.post(url, formData);
  }

  getOneDRPById(id) {
    let url = `discount/getId?id=${id}`;
    return axiosClient.get(url);
  }

  updateOneDRP(id, formData) {
    let url = `discount/update?id=${id}`;
    return axiosClient.put(url, formData);
  }

  // line MP
  addOneMP(formData) {
    let url = `moneyPromotion/add`;
    return axiosClient.post(url, formData);
  }

  getOneMPById(id) {
    let url = `moneyPromotion/getId?id=${id}`;
    return axiosClient.get(url);
  }

  updateOneMP(id, formData) {
    let url = `moneyPromotion/update?id=${id}`;
    return axiosClient.put(url, formData);
  }

  // line V

  addOneV(formData) {
    let url = `voucher`;
    return axiosClient.post(url, formData);
  }

  getOneVById(id) {
    let url = `voucher/getId?id=${id}`;
    return axiosClient.get(url);
  }

  getOneVByCode(code) {
    let url = `voucher/get?code=VCLFRR5P89F2YW`;
    return axiosClient.get(url);
  }
  // updateOneV(id, formData) {
  //   let url = `moneyPromotion/update?id=${id}`;
  //   return axiosClient.put(url, formData);
  // }

  //gift product
  addOneGift(formData) {
    let url = `giftProduct/add`;
    return axiosClient.post(url, formData);
  }
}

const promotionApi = new PromotionApi();
export default promotionApi;
