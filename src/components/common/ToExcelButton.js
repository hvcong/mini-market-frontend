// import { DownloadOutlined } from "@ant-design/icons";
// import React from "react";
// import saveAs from "file-saver";
// import ExcelJS from "exceljs";
// import * as XLSX from "xlsx";
// import { InboxOutlined } from "@ant-design/icons";
// import { message, Upload } from "antd";
// const { Dragger } = Upload;
// const props = {
//   name: "file",
//   multiple: true,
//   onChange(info) {
//     console.log(info);
//   },
//   onDrop(e) {
//     console.log("Dropped files", e.dataTransfer.files);
//   },
// };

const ToExcelButton = ({ nameTemplate, data }) => {
  function exportFile() {
    const ExcelJSWorkbook = new ExcelJS.Workbook();
    var worksheet = ExcelJSWorkbook.addWorksheet("DSGiaBan");

    worksheet.mergeCells("A2:F2");

    const customCell = worksheet.getCell("A2");
    customCell.font = {
      name: "Times New Roman",
      family: 4,
      size: 20,
      bold: true,
    };
    customCell.alignment = { vertical: "middle", horizontal: "center" };

    customCell.value = "Danh sách phiếu nhập hàng";

    let header = [
      "Mã phiếu nhập hàng",
      "Nhà cung cấp",
      "Ngày nhập",
      "Tổng tiền",
      "Trạng thái",
      "Ghi chú",
    ];

    var headerRow = worksheet.addRow();
    var headerRow = worksheet.addRow();
    var headerRow = worksheet.addRow();

    worksheet.getRow(5).font = { bold: true };

    for (let i = 0; i < 6; i++) {
      let currentColumnWidth = "123";
      worksheet.getColumn(i + 1).width =
        currentColumnWidth !== undefined ? currentColumnWidth / 6 : 20;
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
      let status = "";
      if (element.status == "complete") {
        status = "Hoàn thành";
      } else if (element.status == "pending") {
        status = "Tạo mới";
      } else {
        status = "Đã hủy";
      }
      worksheet.addRow(["aa", "aa", "aa", "aa", status, "aa"]);
    });

    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `DSPhieuNhapHang.xlsx`
      );
    });
  }

  //   async function handleOnChange(e) {
  //     const file = e.target.files[0];
  //     const data = await file.arrayBuffer();

  //     const workbook = XLSX.read(data);
  //     console.log(workbook);
  //     const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  //     const jsonData = XLSX.utils.sheet_to_json(worksheet);
  //     console.log(jsonData);
  //   }
  return (
    // <Button
    //   icon={<DownloadOutlined />}
    //   onClick={() => {
    //     // exportFile();
    //     importFile();
    //   }}
    // >
    //     <Upload />
    //   Xuất file .excel
    // </Button>
    <input type="file" onChange={(e) => handleOnChange(e)} />
  );
};

// export default ToExcelButton;
