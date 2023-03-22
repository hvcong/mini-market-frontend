import axiosClient from "./axiosClient";
class AddressApi {
  getAllCity() {
    let url = `city/get`;
    return axiosClient.get(url);
  }

  getAllDistrictByCityId(cityId) {
    let url = `district/get`;
    return axiosClient.get(url);
  }

  getAllWardByDistrictId(districtId) {
    let url = `ward/get`;
    return axiosClient.get(url);
  }

  addHomeAddress(formData) {
    let url = "/home/add";
    return axiosClient.post(url, formData);
  }
}

const addressApi = new AddressApi();
export default addressApi;
