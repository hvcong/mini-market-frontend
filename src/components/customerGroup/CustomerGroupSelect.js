import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Select, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userApi from "./../../api/userApi";

const CustomerGroupSelect = ({ ...props }) => {
  const [listType, setListType] = useState([]);

  useEffect(() => {
    getCustomerTypes();
    return () => {};
  }, []);

  async function getCustomerTypes() {
    let res = await userApi.getAllCustomerType();
    if (res.isSuccess) {
      setListType(res.typeCustomers);
    }
  }

  return (
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
      options={(listType || []).map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      })}
      size="small"
      allowClear
    />
  );
};

export default CustomerGroupSelect;
