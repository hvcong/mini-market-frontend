import { Button, message } from "antd";
import React from "react";
import { DownloadOutlined } from "@ant-design/icons";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import priceHeaderApi from "../../api/priceHeaderApi";
import storeApi from "../../api/storeApi";
import { compareDMY, sqlToDDmmYYY, sqlToHHmmDDmmYYYY } from "../../utils";
import { useSelector } from "react-redux";
import { baseURL } from "../../api/axiosClient";
const numFmtStr = '_(""* #,##0_);_(""* (#,##0);_(""* "-"??_);_(@_)';
const moneyFmtStr = '_(""* #,##0.00_);_(""* (#,##0.00);_(""* "-"??_);_(@_)';

const ExportExcelButton = ({ nameTemplate, disabled, ...props }) => {
  function exportFile() {
    if (nameTemplate == "price") {
      priceExport(props);
    }
    if (nameTemplate == "storeInput") {
      storeInputExport(props);
    }

    if (nameTemplate == "StatisStorage") {
      statisStorage(props);
    }

    if (nameTemplate == "StatisStoreInput") {
      statisStoreInput(props);
    }

    if (nameTemplate == "StatisPromotions") {
      statisPromotions(props);
    }

    if (nameTemplate == "StatisRetrieves") {
      statisRetrieves(props);
    }
    if (nameTemplate == "StatisBillsCustomers") {
      statisBillsCustomers(props);
    }

    if (nameTemplate == "StatisBillsDay") {
      statisBillsDay(props);
    }
  }

  return (
    <Button
      icon={<DownloadOutlined />}
      disabled={disabled}
      onClick={() => {
        exportFile();
      }}
    >
      Xuất file
    </Button>
  );
};

export default ExportExcelButton;

// done
async function statisStorage({ data, headerNameList, date }) {
  let newFile = await createFile(`${baseURL}files/reportFile.xlsx`, "xlsx");

  const newData = await newFile.arrayBuffer();
  const ExcelJSWorkbook = new ExcelJS.Workbook();
  await ExcelJSWorkbook.xlsx.load(newData);

  ExcelJSWorkbook.removeWorksheet("Bảng Kê Trả Hàng");
  ExcelJSWorkbook.removeWorksheet("DSBH Theo Ngay");
  ExcelJSWorkbook.removeWorksheet("Tong ket KM");
  ExcelJSWorkbook.removeWorksheet("Bang Ke Hang Hoa Nhap Vao");
  // ExcelJSWorkbook.removeWorksheet("Báo Cáo Tồn Kho");
  ExcelJSWorkbook.removeWorksheet("DSBH Theo KH");
  let worksheet = ExcelJSWorkbook.getWorksheet("Báo Cáo Tồn Kho");

  let headerNames2 = headerNameList.map((item) => item.title);

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
  customCell.value = "Ngày:" + sqlToDDmmYYY(date);

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

    worksheet.mergeCells(`A${length + rowStartInd}:G${length + rowStartInd}`);
    let lastRow = worksheet.getRow(rowStartInd + length);
    lastRow.getCell("I").value = {
      formula: `SUM(I9:I${rowStartInd + length - 1})`,
    };
    lastRow.getCell("J").value = {
      formula: `SUM(J9:J${rowStartInd + length - 1})`,
    };
    lastRow.getCell("K").value = {
      formula: `SUM(K9:K${rowStartInd + length - 1})`,
    };
    lastRow.getCell("L").value = {
      formula: `SUM(L9:L${rowStartInd + length - 1})`,
    };
    lastRow.getCell("M").value = {
      formula: `SUM(M9:M${rowStartInd + length - 1})`,
    };
    lastRow.getCell("N").value = {
      formula: `SUM(N9:N${rowStartInd + length - 1})`,
    };
    lastRow.getCell("O").value = {
      formula: `SUM(O9:O${rowStartInd + length - 1})`,
    };
    lastRow.getCell("P").value = {
      formula: `SUM(P9:P${rowStartInd + length - 1})`,
    };
    lastRow.getCell("N").value = {
      formula: `SUM(N9:N${rowStartInd + length - 1})`,
    };
  } else {
    worksheet.spliceRows(rowStartInd, 1);
  }
  ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `Thống kê tồn kho.xlsx`
    );
  });
}

// done
async function statisStoreInput({ data, headerNameList, fromDate, toDate }) {
  let newFile = await createFile(`${baseURL}files/reportFile.xlsx`, "xlsx");

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

  let headerNames2 = headerNameList.map((item) => item.title);

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

async function statisPromotions({
  data,
  headerNameList,
  fromDate,
  toDate,
  employeeName,
}) {
  let newFile = await createFile(`${baseURL}files/reportFile.xlsx`, "xlsx");

  const newData = await newFile.arrayBuffer();
  const ExcelJSWorkbook = new ExcelJS.Workbook();
  await ExcelJSWorkbook.xlsx.load(newData);

  ExcelJSWorkbook.removeWorksheet("Bảng Kê Trả Hàng");
  ExcelJSWorkbook.removeWorksheet("DSBH Theo Ngay");
  // ExcelJSWorkbook.removeWorksheet("Tong ket KM");
  ExcelJSWorkbook.removeWorksheet("Bang Ke Hang Hoa Nhap Vao");
  ExcelJSWorkbook.removeWorksheet("Báo Cáo Tồn Kho");
  ExcelJSWorkbook.removeWorksheet("DSBH Theo KH");
  let worksheet = ExcelJSWorkbook.getWorksheet("Tong ket KM");

  // header info
  var newRow = worksheet.getRow(1);
  newRow.getCell(1).value =
    "Thời gian xuất báo cáo: " + sqlToHHmmDDmmYYYY(new Date());
  var newRow = worksheet.getRow(2);
  newRow.getCell(1).value = "Nhân viên xuất báo cáo: " + employeeName;

  // time
  var customCell = worksheet.getRow(4).getCell(1);
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

  let rowStartInd = 8;
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

    lastRow.getCell("I").value = {
      formula: `SUM(I8:I${rowStartInd + length - 1})`,
    };
    lastRow.getCell("M").value = {
      formula: `SUM(M8:M${rowStartInd + length - 1})`,
    };
    lastRow.getCell("N").value = {
      formula: `SUM(N8:N${rowStartInd + length - 1})`,
    };
    lastRow.getCell("O").value = {
      formula: `SUM(O8:O${rowStartInd + length - 1})`,
    };
    lastRow.getCell("P").value = {
      formula: `SUM(P8:P${rowStartInd + length - 1})`,
    };
    lastRow.getCell("Q").value = {
      formula: `SUM(Q8:Q${rowStartInd + length - 1})`,
    };
    lastRow.getCell("R").value = {
      formula: `SUM(R8:R${rowStartInd + length - 1})`,
    };
    lastRow.getCell("S").value = {
      formula: `SUM(S8:S${rowStartInd + length - 1})`,
    };
    lastRow.getCell("T").value = {
      formula: `SUM(T8:T${rowStartInd + length - 1})`,
    };

    // lastRow.getCell("M").value = {
    //   formula: `SUM(M9:M${rowStartInd + length - 1})`,
    // };

    // worksheet.mergeCells(`A${length + rowStartInd}:I${length + rowStartInd}`);
    // lastRow.getCell(1).value = "Tổng giá trị";
    // lastRow.getCell(1).alignment = {
    //   horizontal: "right",
    // };
  } else {
    worksheet.spliceRows(rowStartInd, 1);
  }

  ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `Tổng kết CTKM.xlsx`
    );
  });
}

// done
async function statisRetrieves({ data, headerNameList, fromDate, toDate }) {
  let newFile = await createFile(`${baseURL}files/reportFile.xlsx`, "xlsx");

  const newData = await newFile.arrayBuffer();
  const ExcelJSWorkbook = new ExcelJS.Workbook();
  await ExcelJSWorkbook.xlsx.load(newData);

  // ExcelJSWorkbook.removeWorksheet("Bảng Kê Trả Hàng");
  ExcelJSWorkbook.removeWorksheet("DSBH Theo Ngay");
  ExcelJSWorkbook.removeWorksheet("Tong ket KM");
  ExcelJSWorkbook.removeWorksheet("Bang Ke Hang Hoa Nhap Vao");
  ExcelJSWorkbook.removeWorksheet("Báo Cáo Tồn Kho");
  ExcelJSWorkbook.removeWorksheet("DSBH Theo KH");
  let worksheet = ExcelJSWorkbook.getWorksheet("Bảng Kê Trả Hàng");

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

    lastRow.getCell("N").value = {
      formula: `SUM(N9:N${rowStartInd + length - 1})`,
    };

    lastRow.getCell("M").value = {
      formula: `SUM(M9:M${rowStartInd + length - 1})`,
    };

    worksheet.mergeCells(`A${length + rowStartInd}:I${length + rowStartInd}`);
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
      `Bảng kê chi tiết hàng hóa đơn trả hàng.xlsx`
    );
  });
}

//done
async function statisBillsCustomers({
  data,
  headerNameList,
  fromDate,
  toDate,
}) {
  let newFile = await createFile(`${baseURL}files/reportFile.xlsx`, "xlsx");

  const newData = await newFile.arrayBuffer();
  const ExcelJSWorkbook = new ExcelJS.Workbook();
  await ExcelJSWorkbook.xlsx.load(newData);

  ExcelJSWorkbook.removeWorksheet("Bảng Kê Trả Hàng");
  ExcelJSWorkbook.removeWorksheet("DSBH Theo Ngay");
  ExcelJSWorkbook.removeWorksheet("Tong ket KM");
  ExcelJSWorkbook.removeWorksheet("Bang Ke Hang Hoa Nhap Vao");
  ExcelJSWorkbook.removeWorksheet("Báo Cáo Tồn Kho");
  // ExcelJSWorkbook.removeWorksheet("DSBH Theo KH");
  let worksheet = ExcelJSWorkbook.getWorksheet("DSBH Theo KH");

  // header info
  var newRow = worksheet.getRow(1);
  newRow.getCell(1).value = "Tên cửa hàng: ECO MARKET";

  var newRow = worksheet.getRow(2);
  newRow.getCell(1).value =
    "Địa chỉ cửa hàng: 29/8/7 đại lộ 15, tòa nhà 7, Hiệp Bình Chánh, Thủ Đức";

  var newRow = worksheet.getRow(3);
  newRow.getCell(1).value = "Ngày in: " + sqlToHHmmDDmmYYYY(new Date());

  // time
  var customCell = worksheet.getRow(5).getCell(1);
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

  let rowStartInd = 8;
  let length = (data && data.length) || 0;

  let stt = 1;
  let newList = data.map((item, index) => {
    if (index < length - 1) {
      let nextItem = data[index + 1];
      if (item["customerId"] == nextItem["customerId"]) {
        return {
          ...item,
          index: stt,
        };
      } else {
        stt += 1;
        return {
          ...item,
          index: stt - 1,
        };
      }
    } else {
      return {
        ...item,
        index: stt,
      };
    }
  });

  data = newList;

  if (length != 0) {
    worksheet.duplicateRow(rowStartInd, length - 1, true);
    let count = 0;
    data.map((item, index) => {
      count++;
      let rowInd = index + rowStartInd;
      let row = worksheet.getRow(rowInd);

      if (index < length - 1) {
        let nextItem = data[index + 1];
        if (item["customerId"] != nextItem["customerId"]) {
          if (count > 1) {
            worksheet.mergeCells(`A${rowInd - count + 1}:A${rowInd}`);
            count = 0;
          }
        }
      } else {
        let beforeItem = data[index - 1];
        if (item["customerId"] == beforeItem["customerId"]) {
          if (count > 1) {
            worksheet.mergeCells(`A${rowInd - count + 1}:A${rowInd}`);
            count = 0;
          }
        }
      }

      let keys = Object.keys(item);
      keys.map((key, index) => {
        row.getCell(index + 1).value = item[key];
      });
    });

    // sum row
    // let lastRow = worksheet.getRow(rowStartInd + length);

    // lastRow.getCell("N").value = {
    //   formula: `SUM(N9:N${rowStartInd + length - 1})`,
    // };

    // lastRow.getCell("M").value = {
    //   formula: `SUM(M9:M${rowStartInd + length - 1})`,
    // };

    // worksheet.mergeCells(`A${length + rowStartInd}:I${length + rowStartInd}`);
    // lastRow.getCell(1).value = "Tổng giá trị";
    // lastRow.getCell(1).alignment = {
    //   horizontal: "right",
    // };
  } else {
    worksheet.spliceRows(rowStartInd, 1);
  }
  //row sumary

  ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `Danh số bán hàng theo khách hàng.xlsx`
    );
  });
}

// done
async function statisBillsDay({ data, headerNameList, fromDate, toDate }) {
  let newFile = await createFile(`${baseURL}files/reportFile.xlsx`, "xlsx");

  const newData = await newFile.arrayBuffer();
  const ExcelJSWorkbook = new ExcelJS.Workbook();
  await ExcelJSWorkbook.xlsx.load(newData);

  ExcelJSWorkbook.removeWorksheet("Bảng Kê Trả Hàng");
  // ExcelJSWorkbook.removeWorksheet("DSBH Theo Ngay");
  ExcelJSWorkbook.removeWorksheet("Tong ket KM");
  ExcelJSWorkbook.removeWorksheet("Bang Ke Hang Hoa Nhap Vao");
  ExcelJSWorkbook.removeWorksheet("Báo Cáo Tồn Kho");
  ExcelJSWorkbook.removeWorksheet("DSBH Theo KH");
  let worksheet = ExcelJSWorkbook.getWorksheet("DSBH Theo Ngay");

  // header info
  var newRow = worksheet.getRow(1);
  newRow.getCell(1).value = "Tên cửa hàng: ECO MARKET";

  var newRow = worksheet.getRow(2);
  newRow.getCell(1).value =
    "Địa chỉ cửa hàng: 29/8/7 đại lộ 15, tòa nhà 7, Hiệp Bình Chánh, Thủ Đức";

  var newRow = worksheet.getRow(3);
  newRow.getCell(1).value = "Ngày in: " + sqlToHHmmDDmmYYYY(new Date());

  // time
  var customCell = worksheet.getRow(5).getCell(1);
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

  let rowStartInd = 8;
  let length = (data && data.length) || 0;

  if (length != 0) {
    let newData = [];
    let count = 0;
    let stt = 1;
    let Esum = 0;
    let Fsum = 0;
    let Gsum = 0;
    data.map((item, index) => {
      newData.push({ ...item, index: stt });
      count++;
      if (index < length - 2) {
        let nextItem = data[index + 1];
        if (item["employeeId"] != nextItem["employeeId"]) {
          newData.push({
            isSubTotalRow: true,
            count,
            index: stt,
          });
          count = 0;
          stt++;
        }
      }
      if (index == length - 1) {
        newData.push({
          isSubTotalRow: true,
          count,
          index: stt,
        });
        count = 0;
        stt++;
      }
    });

    worksheet.duplicateRow(rowStartInd, newData.length - 1, true);

    newData.map((item, index) => {
      let rowInd = index + rowStartInd;

      let row = worksheet.getRow(rowInd);

      if (!item.isSubTotalRow) {
        let keys = Object.keys(item);
        keys.map((key, index) => {
          row.getCell(index + 1).value = item[key];

          if (index == 4) {
            Esum += item[key];
          }
          if (index == 5) {
            Fsum += item[key];
          }
          if (index == 6) {
            Gsum += item[key];
          }
        });
      } else {
        worksheet.mergeCells(`A${rowInd - item.count}:A${rowInd}`);
        row.getCell(1).value = item.index;

        var customCell = row.getCell("D");
        customCell.value = "Tổng cộng";

        var customCell = row.getCell("E");
        customCell.value = {
          formula: `SUM(E${rowInd - item.count}:E${rowInd - 1})`,
        };
        var customCell = row.getCell("F");
        customCell.value = {
          formula: `SUM(F${rowInd - item.count}:F${rowInd - 1})`,
        };
        var customCell = row.getCell("G");
        customCell.value = {
          formula: `SUM(G${rowInd - item.count}:G${rowInd - 1})`,
        };
      }
    });

    // sum row
    let lastRow = worksheet.getRow(rowStartInd + newData.length);

    lastRow.getCell("E").value = Esum;
    lastRow.getCell("F").value = Fsum;
    lastRow.getCell("G").value = Gsum;
  } else {
    worksheet.spliceRows(rowStartInd, 1);
  }
  //row sumary

  ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `Danh số bán hàng theo ngày.xlsx`
    );
  });
}

function priceExport({ data, title }) {
  const ExcelJSWorkbook = new ExcelJS.Workbook();
  var worksheet = ExcelJSWorkbook.addWorksheet("DSGiaBan");

  worksheet.mergeCells("A2:E2");

  const customCell = worksheet.getCell("A2");
  customCell.font = {
    name: "Times New Roman",
    family: 4,
    size: 20,
    bold: true,
  };
  customCell.alignment = { vertical: "middle", horizontal: "center" };

  customCell.value = title;

  let header = ["Mã SP", "Tên SP", "Mã ĐVT", "Số lượng quy đổi", "Đơn giá"];

  var headerRow = worksheet.addRow();
  var headerRow = worksheet.addRow();
  var headerRow = worksheet.addRow();

  worksheet.getRow(5).font = { bold: true };

  for (let i = 0; i < 5; i++) {
    // let currentColumnWidth = "123";
    if (i == 0) {
      worksheet.getColumn(i + 1).width = 5;
    } else {
      worksheet.getColumn(i + 1).width = 20;
    }
    let cell = headerRow.getCell(i + 1);
    cell.value = header[i];
  }

  worksheet.autoFilter = {
    from: {
      row: 5,
      column: 1,
    },
    to: {
      row: 5,
      column: 6,
    },
  };

  data.forEach((element) => {
    worksheet.addRow([
      element.productId,
      element.productName,
      element.unitTypeId,
      element.convertionQuantity,
      element.price,
    ]);
  });

  ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `${title}.xlsx`
    );
  });
}

async function storeInputExport({ data, title, inputStoreId }) {
  let res = await storeApi.getOneInputById(inputStoreId);
  if (!res.isSuccess) {
    message.error("Có lỗi xảy, vui lòng thử lại!");
    return;
  }

  let ticketHeader = res.input;

  const ExcelJSWorkbook = new ExcelJS.Workbook();
  var worksheet = ExcelJSWorkbook.addWorksheet("DSNhapKho");

  worksheet.mergeCells("A2:E2");

  const customCell = worksheet.getCell("A2");
  customCell.font = {
    name: "Times New Roman",
    family: 4,
    size: 20,
    bold: true,
  };
  customCell.alignment = { vertical: "middle", horizontal: "center" };

  customCell.value = title;

  // header info
  var newRow = worksheet.addRow();
  newRow.getCell(1).value = "Mã phiếu nhập";
  newRow.getCell(1).font = { bold: true };
  newRow.getCell(2).value = ticketHeader.id;

  var newRow = worksheet.addRow();
  newRow.getCell(1).value = "Mã nhân viên";
  newRow.getCell(1).font = { bold: true };
  newRow.getCell(2).value = ticketHeader.EmployeeId;

  var newRow = worksheet.addRow();
  newRow.getCell(1).value = "Thời gian nhập";
  newRow.getCell(1).font = { bold: true };
  newRow.getCell(2).value = sqlToHHmmDDmmYYYY(ticketHeader.createAt);

  var newRow = worksheet.addRow();
  newRow.getCell(1).value = "Ghi chú";
  newRow.getCell(1).font = { bold: true };
  newRow.getCell(2).value = ticketHeader.note;

  // table
  let header = ["Mã SP", "Tên SP", "Mã ĐVT", "Số lượng"];
  var headerRow = worksheet.addRow();
  var headerRow = worksheet.addRow();
  var headerRow = worksheet.addRow();
  headerRow.font = { bold: true };

  for (let i = 0; i < 4; i++) {
    // let currentColumnWidth = "123";
    if (i == 0) {
      worksheet.getColumn(i + 1).width = 5;
    } else {
      worksheet.getColumn(i + 1).width = 20;
    }
    let cell = headerRow.getCell(i + 1);
    cell.value = header[i];
  }

  // worksheet.autoFilter = {
  //   from: {
  //     row: 9,
  //     column: 1,
  //   },
  //   to: {
  //     row: 9,
  //     column: 4,
  //   },
  // };

  data.forEach((element) => {
    worksheet.addRow([
      element.productId,
      element.productName,
      element.unitTypeId,
      element.quantity,
    ]);
  });

  ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `${title}.xlsx`
    );
  });
}
async function createFile(url, type) {
  if (typeof window === "undefined") return; // make sure we are in the browser
  const response = await fetch(url);
  const data = await response.blob();
  const metadata = {
    type: type || "video/quicktime",
  };
  return new File([data], url, metadata);
}
