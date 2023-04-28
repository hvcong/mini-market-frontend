import { sqlToAntd } from "../utils";
import axiosClient from "./axiosClient";
class StatisApi {
  getAllByCustomer(formData) {
    let url = `bill/customer`;

    return axiosClient.post(url, formData);
  }

  getAllStorage(formData) {
    let url = `store/stastics`;

    return axiosClient.post(url, formData);
  }

  getAllRetrieves(formData) {
    let url = `bill/retrieve`;
    return axiosClient.post(url, formData);
  }

  getAllPromotions(formData) {
    let url = `promotion/stastics`;
    return axiosClient.post(url, formData);
  }

  getAllByEmployee(formData) {
    let url = `bill/from`;

    return axiosClient.post(url, formData);
  }

  getAllStoreInput(formData) {
    let url = `input/stastics`;

    return axiosClient.post(url, formData);
  }
}

const statisApi = new StatisApi();
export default statisApi;
