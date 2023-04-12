import axiosClient from "./axiosClient";
class AddressApi {
  getAllCity() {
    let url = `city/get`;
    return axiosClient.get(url);
  }

  getAllDistrict() {
    let url = `district/get`;
    return axiosClient.get(url);
  }

  getAllWard() {
    let url = `ward/get`;
    return axiosClient.get(url);
  }

  getAllDistrictByCityId(cityId) {
    let url = `district/byCity?cityId=${cityId}`;
    return axiosClient.get(url);
  }

  getAllWardByDistrictId(districtId) {
    let url = `ward/byDistrict?districtId=${districtId}`;
    return axiosClient.get(url);
  }

  addHomeAddress(formData) {
    let url = "/home/add";
    return axiosClient.post(url, formData);
  }
}

const addressApi = new AddressApi();
export default addressApi;
