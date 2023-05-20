import { Button, Input, message } from "antd";
import React, { useRef } from "react";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { getPUTid } from "../../utils";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import priceLineApi from "../../api/priceLineApi";
import { useDispatch } from "react-redux";
import { setRefreshPriceLines } from "../../store/slices/priceLineSlice";
import storeApi from "../../api/storeApi";
import productApi from "../../api/productApi";
import fileaaa from "../../assets/files/reportFile.xlsx";
import imageApi from "../../api/imageApi";
//console.log("file", fileaaa);

const ImportExcelButton = ({
  disabled,
  templateName,
  oldData = [],
  priceHeaderId,
  storeInputHeaderId,
  handleInportOke,
}) => {
  const inputRef = useRef();
  const dispatch = useDispatch();

  async function handleOnChangeFile(e) {
    if (templateName == "price") {
      const file = e.target.files[0];
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      let isCheck = true;
      const ExcelJSWorkbook = new ExcelJS.Workbook();
      const newWorkSheet = ExcelJSWorkbook.addWorksheet("DSGiaBan");

      const headerRow = newWorkSheet.addRow();

      for (let i = 0; i < 4; i++) {
        newWorkSheet.getColumn(i + 1).width = 30;
      }

      headerRow.getCell(1).value = "productId";
      headerRow.getCell(2).value = "unitTypeId";
      headerRow.getCell(3).value = "price";
      headerRow.getCell(4).value = "Lỗi";

      for (let i = 0; i < jsonData.length; i++) {
        let count = 0;
        let errMess = "";
        let rowData = jsonData[i];

        let price = rowData.price;
        let productId = rowData.productId;
        let unitTypeId = rowData.unitTypeId;

        // check trùng in file
        jsonData.map((item) => {
          if (item.productId == productId && item.unitTypeId == unitTypeId) {
            count++;
          }
        });
        if (count > 1) {
          errMess += "SP và ĐVT này đã bị trùng, ";
        }

        // check trùng in oldData
        let isExitInOldData = false;
        oldData.map((item) => {
          if (item.productId == productId && item.unitTypeId == unitTypeId) {
            isExitInOldData = true;
          }
        });

        if (isExitInOldData) {
          errMess += "SP và ĐVT này đã thêm vào bảng trước đó, ";
        }

        let putId = await getPUTid(productId, unitTypeId);
        if (!putId) {
          errMess += "SP không có ĐVT này, ";
        } else {
          rowData.putId = putId;
        }

        if (!Number(price) || price < 0) {
          errMess += "Giá phải phải >= 0";
        }

        if (errMess) {
          isCheck = false;
        }
        let newRow = newWorkSheet.addRow();
        newRow.getCell(1).value = productId;
        newRow.getCell(2).value = unitTypeId;
        newRow.getCell(3).value = price;
        newRow.getCell(4).value = errMess;
      }

      if (!isCheck) {
        message.error("Dữ liệu file không hợp lệ!");
        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            `Bảng giá lỗi.xlsx`
          );
        });
      } else {
        let res = {};
        for (const item of jsonData) {
          let formData = {
            price: item.price,
            productUnitTypeId: item.putId,
            headerId: priceHeaderId,
          };
          res = await priceLineApi.addOne(formData);
        }
        if (res.isSuccess) {
          dispatch(setRefreshPriceLines());
          message.info("Thêm danh sách giá thành công");
        } else {
          message.error("File dữ liệu không hợp lệ!");
        }
      }
    }

    if (templateName == "storeInput") {
      const file = e.target.files[0];
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      let isCheck = true;
      const ExcelJSWorkbook = new ExcelJS.Workbook();
      const newWorkSheet = ExcelJSWorkbook.addWorksheet("DSNhapKho");

      const headerRow = newWorkSheet.addRow();

      for (let i = 0; i < 4; i++) {
        newWorkSheet.getColumn(i + 1).width = 30;
      }

      headerRow.getCell(1).value = "productId";
      headerRow.getCell(2).value = "unitTypeId";
      headerRow.getCell(3).value = "quantity";
      headerRow.getCell(4).value = "Lỗi";
      //console.log(jsonData);

      for (let i = 0; i < jsonData.length; i++) {
        let count = 0;
        let errMess = "";
        let rowData = jsonData[i];

        let quantity = rowData.quantity;
        let productId = rowData.productId;
        let unitTypeId = rowData.unitTypeId;

        let res = await productApi.findOneById(productId);
        if (!res.isSuccess) {
          errMess += "Mã SP này không chính xác, ";
        } else {
          // check trùng in file
          jsonData.map((item) => {
            if (item.productId == productId && item.unitTypeId == unitTypeId) {
              count++;
            }
          });
          if (count > 1) {
            errMess += "SP và ĐVT này đã bị trùng, ";
          }
          let putId = await getPUTid(productId, unitTypeId);
          if (!putId) {
            errMess += "SP không có ĐVT này, ";
          } else {
            rowData.putId = putId;
          }
        }

        // check trùng in oldData
        let isExitInOldData = false;
        oldData.map((item) => {
          if (item.productId == productId && item.unitTypeId == unitTypeId) {
            isExitInOldData = true;
          }
        });

        if (isExitInOldData) {
          errMess += "SP và ĐVT này đã thêm vào bảng trước đó, ";
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
          errMess += "SL phải là số nguyên và phải > 0, ";
        }

        if (errMess) {
          isCheck = false;
        }
        let newRow = newWorkSheet.addRow();
        newRow.getCell(1).value = productId;
        newRow.getCell(2).value = unitTypeId;
        newRow.getCell(3).value = quantity;
        newRow.getCell(4).value = errMess;
      }

      if (!isCheck) {
        message.error("Dữ liệu file không hợp lệ!");
        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
          saveAs(
            new Blob([buffer], { type: "application/octet-stream" }),
            `File nhập kho lỗi.xlsx`
          );
        });
      } else {
        message.info("Nhập file thành công");
        handleInportOke(jsonData);
      }
    }
  }

  return (
    <Button
      icon={<UploadOutlined />}
      onClick={() => {
        inputRef.current.click();
      }}
      disabled={disabled}
    >
      Nhập file
      <input
        type="file"
        ref={inputRef}
        accept=".xlsx"
        style={{
          opacity: 0,
          width: 0,
          height: 0,
        }}
        value=""
        onChange={handleOnChangeFile}
        placeholder="Chọn file"
      />
    </Button>
  );
};

export default ImportExcelButton;
