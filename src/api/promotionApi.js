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

  // line PP
  addOnePP(formData) {
    let url = `productPromotion/add`;
    return axiosClient.post(url, formData);
  }

  getOnePPById(id) {
    return {
      isSuccess: true,
    };
  }

  // line DRP
  addOneDRP(formData) {
    let url = `discount/add`;
    return axiosClient.post(url, formData);
  }

  getOneDRPById(id) {
    return {
      isSuccess: true,
    };
  }

  addOneMP(formData) {
    let url = `moneyPromotion/add`;
    return axiosClient.post(url, formData);
  }

  getOneMPById(id) {
    return {
      isSuccess: true,
    };
  }

  addOneV(formData) {
    let url = `voucher`;
    return axiosClient.post(url, formData);
  }

  getOneVById(id) {
    return {
      isSuccess: true,
    };
  }

  //gift product
  addOneGift(formData) {
    let url = `giftProduct/add`;
    return axiosClient.post(url, formData);
  }
}

const promotionApi = new PromotionApi();
export default promotionApi;
