import axiosClient from "./axiosClient";
class UnitTypeApi {
  addOne(formData) {
    let url = "unitType/add";
    return axiosClient.post(url, formData);
  }

  updateOne(id, formData) {
    let url = `unitType/update?id=${id}`;
    return axiosClient.put(url, formData);
  }

  getMany(page = 1, limit = 10) {
    let url = `unitType/getLimit?_page=${page}&_limit=${limit}`;
    return axiosClient.get(url);
  }

  getOneById(id) {
    let url = `unitType/getId?id=${id}`;
    return axiosClient.get(url);
  }

  findAllByProductId(productId) {
    let url = `unitType/productId?productId=${productId}`;
    return axiosClient.get(url);
  }

  getAll(type) {
    let url = "";
    if (type == "base") {
      url = `unitType/base`;
    } else {
      url = `unitType/others`;
    }
    return axiosClient.get(url);
  }
}

const unitTypeApi = new UnitTypeApi();
export default unitTypeApi;
