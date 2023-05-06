import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

async function createFile(url, type) {
  if (typeof window === "undefined") return; // make sure we are in the browser
  const response = await fetch(url);
  const data = await response.blob();
  const metadata = {
    type: type || "video/quicktime",
  };
  return new File([data], url, metadata);
}

// done
async function statisStoreInput({ data, headerNameList, fromDate, toDate }) {
  let newFile = await createFile(
    "http://localhost:3000/files/reportFile.xlsx",
    "xlsx"
  );

  const newData = await newFile.arrayBuffer();
  const ExcelJSWorkbook = new ExcelJS.Workbook();
  await ExcelJSWorkbook.xlsx.load(newData);

  ExcelJSWorkbook.removeWorksheet("Bảng Kê Trả Hàng");
  ExcelJSWorkbook.removeWorksheet("DSBH Theo Ngay");
  ExcelJSWorkbook.removeWorksheet("Tong ket KM");
  // ExcelJSWorkbook.removeWorksheet("Bang Ke Hang Hoa Nhap Vao");
  ExcelJSWorkbook.removeWorksheet("Báo Cáo Tồn Kho");
  ExcelJSWorkbook.removeWorksheet("DSBH Theo KH");
  let worksheet = ExcelJSWorkbook.getWorksheet("Bang Ke Hang Hoa Nhap Vao");

  // header info
  var newRow = worksheet.getRow(1);
  newRow.getCell(1).value = "Tên cửa hàng: ECO MARKET";

  var newRow = worksheet.getRow(2);
  newRow.getCell(1).value =
    "Địa chỉ cửa hàng: 29/8/7 đại lộ 15, tòa nhà 7, Hiệp Bình Chánh, Thủ Đức";

  var newRow = worksheet.getRow(3);
  newRow.getCell(1).value = "Ngày in: " + sqlToHHmmDDmmYYYY(new Date());

  // time
  var customCell = worksheet.getRow(6).getCell(1);
  if (compareDMY(new Date(fromDate), new Date(toDate)) == 0) {
    customCell.value = "Ngày:" + sqlToDDmmYYY(fromDate);
  } else {
    customCell.value =
      "Từ  ngày:" +
      sqlToDDmmYYY(fromDate) +
      "   đến ngày:" +
      sqlToDDmmYYY(toDate);
  }

  // add data

  let rowStartInd = 9;
  let length = (data && data.length) || 0;
  if (length != 0) {
    worksheet.duplicateRow(rowStartInd, length - 1, true);
    data.map((item, index) => {
      let indRow = index + rowStartInd;
      var row = worksheet.getRow(indRow);
      let keys = Object.keys(item);
      keys.map((key, i) => {
        row.getCell(i + 1).value = item[key];
      });
    });

    // sum row
    let lastRow = worksheet.getRow(rowStartInd + length);

    lastRow.getCell("G").value = {
      formula: `SUM(G9:G${rowStartInd + length - 1})`,
    };

    worksheet.mergeCells(`A${length + rowStartInd}:F${length + rowStartInd}`);
    lastRow.getCell(1).value = "Tổng giá trị";
    lastRow.getCell(1).alignment = {
      horizontal: "right",
    };
  } else {
    worksheet.spliceRows(rowStartInd, 1);
    worksheet.spliceRows(rowStartInd, 1);
  }

  ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `Thống kê nhập hàng.xlsx`
    );
  });
}
