import { Button, message } from "antd";
import React from "react";
import { DownloadOutlined } from "@ant-design/icons";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import priceHeaderApi from "../../api/priceHeaderApi";
import storeApi from "../../api/storeApi";
import { compareDMY, sqlToDDmmYYY, sqlToHHmmDDmmYYYY } from "../../utils";
import { useSelector } from "react-redux";
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

async function statisStorage({ data, headerNameList, fromDate, toDate }) {
  let headerNames2 = [];
  headerNameList.map((item) => {
    if (item.children) {
      item.children.map((child) => {
        headerNames2.push(child.title);
      });
    }
  });

  const ExcelJSWorkbook = new ExcelJS.Workbook();
  var worksheet = ExcelJSWorkbook.addWorksheet("DSTonKho");

  // header info
  var newRow = worksheet.addRow();
  newRow.getCell(1).value = "Tên cửa hàng: ECO MARKET";

  var newRow = worksheet.addRow();
  newRow.getCell(1).value =
    "Địa chỉ cửa hàng: 29/8/7 đại lộ 15, tòa nhà 7, Hiệp Bình Chánh, Thủ Đức";

  var newRow = worksheet.addRow();
  newRow.getCell(1).value = "Ngày in: " + sqlToHHmmDDmmYYYY(new Date());

  var newRow = worksheet.addRow();
  newRow.getCell(1).value = "Tên báo cáo: BCTK";

  worksheet.mergeCells("A1:Q1");
  worksheet.mergeCells("A2:Q2");
  worksheet.mergeCells("A3:Q3");
  worksheet.mergeCells("A4:Q4");
  worksheet.mergeCells("A5:Q5");
  worksheet.mergeCells("A6:Q6");
  worksheet.mergeCells("A7:H7");
  worksheet.mergeCells("I7:K7");
  worksheet.mergeCells("L7:N7");
  worksheet.mergeCells("O7:Q7");

  var customCell = worksheet.getCell("A5");
  customCell.font = {
    name: "Times New Roman",
    family: 4,
    size: 20,
    bold: true,
  };
  customCell.alignment = { vertical: "middle", horizontal: "center" };
  customCell.value = "BÁO CÁO TỒN KHO";

  customCell = worksheet.getCell("A6");
  customCell.alignment = { vertical: "middle", horizontal: "center" };
  if (compareDMY(new Date(fromDate), new Date(toDate)) == 0) {
    customCell.value = "Ngày:" + sqlToDDmmYYY(fromDate);
  } else {
    customCell.value =
      "Từ  ngày:" +
      sqlToDDmmYYY(fromDate) +
      " đến ngày:" +
      sqlToDDmmYYY(toDate);
  }

  customCell = worksheet.getRow(7).getCell("I");
  customCell.alignment = { vertical: "middle", horizontal: "center" };
  customCell.font = {
    bold: true,
    size: 13,
  };
  customCell.value = "Tồn kho trên báo cáo";

  customCell = worksheet.getRow(7).getCell("L");
  customCell.alignment = { vertical: "middle", horizontal: "center" };
  customCell.font = {
    bold: true,
    size: 13,
  };
  customCell.value = "Hàng đang giữ của giao dịch bán hàng";

  customCell = worksheet.getRow(7).getCell("O");
  customCell.alignment = { vertical: "middle", horizontal: "center" };
  customCell.font = {
    bold: true,
    size: 13,
  };
  customCell.value = "Tồn Kho Có Thể Bán";

  // table
  let headerTable = worksheet.addRow();
  headerTable.font = { bold: true };

  for (let i = 0; i < headerNames2.length; i++) {
    if (i == 0) {
      worksheet.getColumn(i + 1).width = 5;
    } else {
      worksheet.getColumn(i + 1).width = 20;
    }
    let cell = headerTable.getCell(i + 1);
    cell.value = headerNames2[i];
  }

  let keys = [];

  data.forEach((element) => {
    keys = Object.keys(element);
    worksheet.addRow(keys.map((key) => element[key]));
  });
  // worksheet.autoFilter = {
  //   from: {
  //     row: 8,
  //     column: 2,
  //   },
  //   to: {
  //     row: 8,
  //     column: keys.length,
  //   },
  // };

  ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `Thống kê tồn kho.xlsx`
    );
  });
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
    worksheet.spliceRows(10, 1);
    worksheet.spliceRows(9, 1);
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
  let headerNames2 = headerNameList.map((item) => item.title);

  const ExcelJSWorkbook = new ExcelJS.Workbook();
  var worksheet = ExcelJSWorkbook.addWorksheet("TongKetKhuyenMai");

  // header info
  var newRow = worksheet.addRow();
  newRow.getCell(1).value = "Tên cửa hàng: ECO MARKET";

  var newRow = worksheet.addRow();
  newRow.getCell(1).value =
    "Địa chỉ cửa hàng: 29/8/7 đại lộ 15, tòa nhà 7, Hiệp Bình Chánh, Thủ Đức";

  var newRow = worksheet.addRow();
  newRow.getCell(1).value = "Ngày in: " + sqlToHHmmDDmmYYYY(new Date());

  var newRow = worksheet.addRow();
  newRow.getCell(1).value = "Tên nhân viên xuất báo cáo : " + employeeName;

  var newRow = worksheet.addRow();
  newRow.getCell(1).value = "Tên báo cáo: BCTKCTKM";

  worksheet.mergeCells("A1:M1");
  worksheet.mergeCells("A2:M2");
  worksheet.mergeCells("A3:M3");
  worksheet.mergeCells("A4:M4");
  worksheet.mergeCells("A5:M5");
  worksheet.mergeCells("A6:M6");
  worksheet.mergeCells("A7:M7");

  var customCell = worksheet.getCell("A5");
  customCell.font = {
    name: "Times New Roman",
    family: 4,
    size: 20,
    bold: true,
  };
  customCell.alignment = { vertical: "middle", horizontal: "center" };
  customCell.value = "BÁO CÁO TỔNG KẾT CTKM";

  customCell = worksheet.getCell("A6");
  customCell.alignment = { vertical: "middle", horizontal: "center" };
  if (compareDMY(new Date(fromDate), new Date(toDate)) == 0) {
    customCell.value = "Ngày:" + sqlToDDmmYYY(fromDate);
  } else {
    customCell.value =
      "Từ  ngày:" +
      sqlToDDmmYYY(fromDate) +
      "   đến ngày:" +
      sqlToDDmmYYY(toDate);
  }

  // table
  let headerTable = worksheet.addRow();
  headerTable.font = { bold: true };

  for (let i = 0; i < headerNames2.length; i++) {
    if (i == 0) {
      worksheet.getColumn(i + 1).width = 5;
    } else {
      worksheet.getColumn(i + 1).width = 20;
    }
    let cell = headerTable.getCell(i + 1);
    cell.value = headerNames2[i];
  }

  let keys = [];

  data.forEach((element) => {
    keys = Object.keys(element);
    worksheet.addRow(keys.map((key) => element[key]));
  });

  worksheet.getColumn("H").numFmt = numFmtStr;
  worksheet.getColumn("J").numFmt = moneyFmtStr;
  worksheet.getColumn("K").numFmt = moneyFmtStr;
  worksheet.getColumn("L").numFmt = moneyFmtStr;
  worksheet.getColumn("M").numFmt = moneyFmtStr;
  // sumary

  let Hsum = 0;
  let Jsum = 0;
  let Ksum = 0;
  let Lsum = 0;
  let Msum = 0;

  data.map((item) => {
    Hsum += item.quantityApplied || 0;
    Jsum += item.discount || 0;
    Ksum += item.budget || 0;
    Lsum += item.discounted || 0;
    Msum += item.availableBudget || 0;
  });

  newRow = worksheet.addRow();
  newRow.font = { bold: true };
  newRow.alignment = { vertical: "middle", horizontal: "right" };
  let tmp = `A${data.length + 9}:B${data.length + 9}`;
  worksheet.mergeCells(tmp);

  newRow.getCell(1).value = "Tổng CTKM";
  newRow.getCell("H").value = Hsum;
  newRow.getCell("J").value = Jsum;
  newRow.getCell("K").value = Ksum;
  newRow.getCell("L").value = Lsum;
  newRow.getCell("M").value = Msum;

  ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `Tổng kết CTKM.xlsx`
    );
  });
}

// done
async function statisRetrieves({ data, headerNameList, fromDate, toDate }) {
  let newFile = await createFile(
    "http://localhost:3000/files/reportFile.xlsx",
    "xlsx"
  );

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
    worksheet.spliceRows(10, 1);
    worksheet.spliceRows(9, 1);
  }

  ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `Bảng kê chi tiết hàng hóa đơn trả hàng.xlsx`
    );
  });
}

async function statisBillsCustomers({
  data,
  headerNameList,
  fromDate,
  toDate,
}) {
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

  //row sumary

  ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `Danh số bán hàng theo khách hàng.xlsx`
    );
  });
}

async function statisBillsDay({ data, headerNameList, fromDate, toDate }) {
  let headerNames2 = headerNameList.map((item) => item.title);

  const ExcelJSWorkbook = new ExcelJS.Workbook();
  var worksheet = ExcelJSWorkbook.addWorksheet("DanhSoBanHangTheoNgay");

  // header info
  var newRow = worksheet.addRow();
  newRow.getCell(1).value = "Tên cửa hàng: ECO MARKET";

  var newRow = worksheet.addRow();
  newRow.getCell(1).value =
    "Địa chỉ cửa hàng: 29/8/7 đại lộ 15, tòa nhà 7, Hiệp Bình Chánh, Thủ Đức";

  var newRow = worksheet.addRow();
  newRow.getCell(1).value = "Ngày in: " + sqlToHHmmDDmmYYYY(new Date());

  var newRow = worksheet.addRow();
  newRow.getCell(1).value = "Tên báo cáo: BKCTMT";

  worksheet.mergeCells("A1:G1");
  worksheet.mergeCells("A2:G2");
  worksheet.mergeCells("A3:G3");
  worksheet.mergeCells("A4:G4");
  worksheet.mergeCells("A5:G5");
  worksheet.mergeCells("A6:G6");
  worksheet.mergeCells("A7:G7");

  var customCell = worksheet.getCell("A5");
  customCell.font = {
    name: "Times New Roman",
    family: 4,
    size: 20,
    bold: true,
  };
  customCell.alignment = { vertical: "middle", horizontal: "center" };
  customCell.value = "DOANH SỐ BÁN HÀNG THEO NGÀY";

  customCell = worksheet.getCell("A6");
  customCell.alignment = { vertical: "middle", horizontal: "center" };
  if (compareDMY(new Date(fromDate), new Date(toDate)) == 0) {
    customCell.value = "Ngày:" + sqlToDDmmYYY(fromDate);
  } else {
    customCell.value =
      "Từ  ngày:" +
      sqlToDDmmYYY(fromDate) +
      "   đến ngày:" +
      sqlToDDmmYYY(toDate);
  }

  // table
  let headerTable = worksheet.addRow();
  headerTable.font = { bold: true };

  for (let i = 0; i < headerNames2.length; i++) {
    if (i == 0) {
      worksheet.getColumn(i + 1).width = 5;
    } else {
      worksheet.getColumn(i + 1).width = 20;
    }
    let cell = headerTable.getCell(i + 1);
    cell.value = headerNames2[i];
  }

  let keys = [];

  data.forEach((element) => {
    keys = Object.keys(element);
    worksheet.addRow(keys.map((key) => element[key]));
  });

  worksheet.getColumn("E").numFmt = moneyFmtStr;
  worksheet.getColumn("F").numFmt = moneyFmtStr;
  worksheet.getColumn("G").numFmt = moneyFmtStr;

  // worksheet.autoFilter = {
  //   from: {
  //     row: 8,
  //     column: 2,
  //   },
  //   to: {
  //     row: 8,
  //     column: keys.length,
  //   },
  // };

  // sumary

  let Esum = 0;
  let Fsum = 0;
  let Gsum = 0;

  data.map((item) => {
    Esum += item.discount;
    Fsum += item.beforeDiscount || 0;
    Gsum += item.cost || 0;
  });

  newRow = worksheet.addRow();
  newRow.font = { bold: true };
  newRow.alignment = { vertical: "middle", horizontal: "right" };
  let tmp = `A${data.length + 9}:D${data.length + 9}`;
  worksheet.mergeCells(tmp);

  newRow.getCell(1).value = "Tổng giá trị";
  newRow.getCell("E").value = Esum;
  newRow.getCell("F").value = Fsum;
  newRow.getCell("G").value = Gsum;

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
