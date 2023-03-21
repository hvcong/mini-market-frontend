import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Select, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import addressApi from "./../api/addressApi";

const AddressSelectItem = ({
  type,
  cityId,
  districtId,
  setAddressItem,
  value,
  ...props
}) => {
  const [list, setList] = useState([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    getAllAddressItem(type);

    if (type == "district") {
      if (cityId) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }

    if (type == "ward") {
      console.log(districtId, cityId);
      if (districtId && cityId) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }

    return () => {};
  }, [cityId, districtId, type]);

  async function getAllAddressItem(type) {
    if (type == "city") {
      let res = await addressApi.getAllCity();
      if (res.isSuccess) {
        setList(res.cities);
      }
    } else if (type == "district") {
      let res = await addressApi.getAllDistrictByCityId(cityId);
      if (res.isSuccess) {
        setList(res.districts);
      }
    } else if (type == "ward") {
      let res = await addressApi.getAllWardByDistrictId(districtId);
      if (res.isSuccess) {
        setList(res.wards);
      }
    }
  }

  return (
    <>
      <Select
        {...props}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? "").includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
        options={(list || []).map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        })}
        value={disabled ? null : value}
        onChange={setAddressItem}
        size="small"
        allowClear
        disabled={disabled}
      />
    </>
  );
};

export default AddressSelectItem;
