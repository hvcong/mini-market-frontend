import axiosClient from "./axiosClient";

class ProductApi {
  getMany(page = 1, limit = 10) {
    let url = `product/get?_page=${page}&_limit=${limit}`;
    return axiosClient.get(url);
  }

  findById(id) {
    let url = `product/getId?id=${id}`;
    return axiosClient.get(url);
  }

  addOne(formData) {
    let url = `product/add`;
    return axiosClient.post(url, formData);
  }

  updateOne(formData) {
    let url = `product/update?id=${formData.id}`;

    return axiosClient.put(url, formData);
  }

  findManyByName(name) {
    let url = `product/getName?name=${name}`;
    return axiosClient.get(url);
  }

  findManyById(id) {
    let url = `product/likeId?productId=${id}`;
    return axiosClient.get(url);
  }

  findOneById(id) {
    let url = `product/getId?id=${id}`;
    return axiosClient.get(url);
  }

  findManyByName_priceState(name) {
    let url = `product/getName?name=${name}`;
    return axiosClient.get(url);
  }
}

const productApi = new ProductApi();
export default productApi;
