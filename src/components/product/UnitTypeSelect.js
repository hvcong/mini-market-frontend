import { Select } from "antd";
import React, { useEffect, useState } from "react";
import unitTypeApi from "./../../api/unitTypeApi";

const UnitTypeSelect = ({
  type,
  handleChange,
  listIdUTSelected,
  value,
  ...props
}) => {
  const [utList, setUtList] = useState([]);

  useEffect(() => {
    getAll(type);
    return () => {};
  }, [type]);

  async function getAll(type) {
    let res = await unitTypeApi.getAll(type);

    if (res.isSuccess) {
      if (type == "base") {
        setUtList(res.baseUnits);
      } else {
        let _utList = res.otherUnits.filter((item) => {
          return !listIdUTSelected.filter((id) => item.id == id).length > 0;
        });
        setUtList(_utList);
      }
    }
  }

  return (
    <Select
      defaultValue="---Đơn vị tính---"
      style={{
        width: 170,
      }}
      onChange={handleChange}
      options={(utList || []).map((item) => {
        return {
          value: item.id,
          label: item.name,
          disabled: listIdUTSelected.filter((id) => id == item.id).length > 0,
        };
      })}
      value={value}
      //   status={errList[index].name && "error"}
      {...props}
    />
  );
};

export default UnitTypeSelect;
