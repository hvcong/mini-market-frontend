import { Button } from "antd";
import React from "react";
import { DownloadOutlined } from "@ant-design/icons";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const DownLoadTemplate = ({ nameTemplate, ...props }) => {
  function exportFile() {
    if (nameTemplate == "price") {
      priceExport(props);
    }

    if (nameTemplate == "storeInput") {
      storeInputExport(props);
    }

    if (nameTemplate == "storeChecking") {
      storeCheckingExport(props);
    }
  }

  return (
    <Button
      icon={<DownloadOutlined />}
      onClick={() => {
        exportFile();
      }}
    >
      Mẫu nhập
    </Button>
  );
};

function priceExport({ title }) {
  const ExcelJSWorkbook = new ExcelJS.Workbook();
  var worksheet = ExcelJSWorkbook.addWorksheet("DSGiaBan");

  const headerRow = worksheet.addRow();
  headerRow.font = {
    bold: true,
  };

  for (let i = 0; i < 4; i++) {
    worksheet.getColumn(i + 1).width = 30;
  }

  headerRow.getCell(1).value = "productId";
  headerRow.getCell(2).value = "unitTypeId";
  headerRow.getCell(3).value = "price";

  ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `${title}.xlsx`
    );
  });
}

function storeInputExport({ title }) {
  const ExcelJSWorkbook = new ExcelJS.Workbook();
  var worksheet = ExcelJSWorkbook.addWorksheet("DSNhapKho");

  const headerRow = worksheet.addRow();
  headerRow.font = {
    bold: true,
  };

  for (let i = 0; i < 4; i++) {
    worksheet.getColumn(i + 1).width = 30;
  }

  headerRow.getCell(1).value = "productId";
  headerRow.getCell(2).value = "unitTypeId";
  headerRow.getCell(3).value = "quantity";

  ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `${title}.xlsx`
    );
  });
}
function storeCheckingExport({ title }) {
  const ExcelJSWorkbook = new ExcelJS.Workbook();
  var worksheet = ExcelJSWorkbook.addWorksheet("DSKiemKho");

  const headerRow = worksheet.addRow();
  headerRow.font = {
    bold: true,
  };

  for (let i = 0; i < 4; i++) {
    worksheet.getColumn(i + 1).width = 30;
  }

  headerRow.getCell(1).value = "productId";
  headerRow.getCell(2).value = "reportUnitTypeId";
  headerRow.getCell(3).value = "quantityByReportUnitype";
  headerRow.getCell(4).value = "quantityByBaseUnitype";

  ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `${title}.xlsx`
    );
  });
}

export default DownLoadTemplate;
