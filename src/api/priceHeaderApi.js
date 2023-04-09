import axiosClient from "./axiosClient";

class PriceHeaderApi {
  getMany(page, limit) {
    let url = `priceHeader/get?_page=${page}&_limit=${limit}`;
    return axiosClient.get(url);
  }

  getOneById(id) {
    let url = `priceHeader/getId?id=${id}`;
    return axiosClient.get(url);
  }

  addOne(formData) {
    let url = "priceHeader/add";
    return axiosClient.post(url, formData);
  }

  updateOne(formData) {
    let url = `priceHeader/update?id=${formData.id}`;
    return axiosClient.put(url, formData);
  }

  getAllOnActive() {
    let url = `priceHeader/active`;
    return axiosClient.get(url);
  }
}

const priceHeaderApi = new PriceHeaderApi();
export default priceHeaderApi;
