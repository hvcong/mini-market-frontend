import { message, Select } from "antd";
import React, { useEffect, useState } from "react";

const UnitTypeSelect = ({
  style,
  listUTs = [],
  utSelectedId,
  index,
  setUTselectedId,
  dataTable,
  status,
}) => {
  const [defaultValue, setDefaultValue] = useState("--Đơn vị tính--");
  const handleChange = (value) => {
    if (checkInTable(value)) {
      setErr("");
      setUTselectedId(value, index);
    } else {
      setErr("Đã tồn tại ");
    }
  };
  const [err, setErr] = useState("");

  function checkInTable(value) {
    let _list = [...listUTs];
    let isCheck = true;

    dataTable.map((item, ind, arr) => {
      if (ind != index && !item.isLastRow && item.product) {
        if (
          item.product.id == arr[index].product.id &&
          item.utSelectedId == value
        ) {
          isCheck = false;
        }
      }
    });
    return isCheck;
  }
  return (
    <>
      <Select
        defaultValue={defaultValue}
        style={style}
        value={utSelectedId || defaultValue}
        onChange={handleChange}
        options={listUTs.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        })}
        status={(err || status) && "error"}
      />
      <div className="error_message">{err}</div>
    </>
  );
};

export default UnitTypeSelect;
