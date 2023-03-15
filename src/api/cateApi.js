import axiosClient from "./axiosClient";

class CateApi {
  getMany(page = 0, limit = 10) {
    let url = `category/get?_page=${page}&_limit=${limit}`;
    return axiosClient.get(url);
  }
  addOne(formData) {
    let url = `category/add`;
    return axiosClient.post(url, formData);
  }
  updateOne(formData) {
    let url = `category/update`;
    return axiosClient.put(url, formData);
  }

  findCategoryById(id) {
    let url = `category/getById?id=${id}`;
    return axiosClient.get(url);
  }

  findSubById(id) {
    let url = `subCategory/getById?id=${id}`;
    return axiosClient.get(url);
  }
}

const cateApi = new CateApi();
export default cateApi;
