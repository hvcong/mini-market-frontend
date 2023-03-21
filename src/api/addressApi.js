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
}

const addressApi = new AddressApi();
export default addressApi;
