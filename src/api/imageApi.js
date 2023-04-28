import axiosClient from "./axiosClient";

class ImageApi {
  uploadOne(file) {
    console.log(file);
  }

  getReportFile() {
    return axiosClient.get("files/reportFile.xlsx");
  }
}

const imageApi = new ImageApi();

export default imageApi;
