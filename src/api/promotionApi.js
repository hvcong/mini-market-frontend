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

  deleteOnePP(id) {
    let url = `productPromotion/delete?id=${id}`;
    return axiosClient.delete(url);
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
  deleteOneDRP(id) {
    let url = `discount/delete?id=${id}`;
    return axiosClient.delete(url);
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

  deleteOneMP(id) {
    let url = `moneyPromotion/delete?id=${id}`;
    return axiosClient.delete(url);
  }

  // line V

  addOneV(formData) {
    let url = `voucher`;
    return axiosClient.post(url, formData);
  }

  updateOneV(id, formData) {
    let url = `voucher/update?id=${id}`;
    return axiosClient.put(url, formData);
  }

  deleteOneV(id) {
    let url = `voucher/delete?id=${id}`;
    return axiosClient.delete(url);
  }

  getOneVById(id) {
    let url = `voucher/getId?id=${id}`;
    return axiosClient.get(url);
  }

  getOneVByCode(code) {
    let url = `voucher/get?code=${code}`;
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

  //// result
  addResult(formData) {
    let url = "result/add";
    return axiosClient.post(url, formData);
  }
}

const promotionApi = new PromotionApi();
export default promotionApi;
