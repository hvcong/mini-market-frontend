import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Select, Space } from "antd";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

let index = 0;

const SelectSubCategory = ({
  status,
  setIdSubCateSelected,
  idCategorySelected,
  idSelected,
}) => {
  const cate = useSelector((state) => state.cate);
  const dispatch = useDispatch();
  let { categories = [] } = cate;

  let subCates = [];
  categories.forEach((category) => {
    if (category.id == idCategorySelected) {
      subCates = category.SubCategories;
    }
  });

  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };

  function onAddNew() {}

  return (
    <Select
      style={{
        width: "100%",
      }}
      disabled={!idCategorySelected}
      placeholder="--Nhóm sản phẩm (cấp 2) --"
      onChange={setIdSubCateSelected}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider
            style={{
              margin: "8px 0",
            }}
          />
          <Space
            style={{
              padding: "0 8px 4px",
            }}
          >
            <Button type="text" icon={<PlusOutlined />} onClick={onAddNew}>
              Thêm
            </Button>
          </Space>
        </>
      )}
      value={idSelected}
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) => (option?.label ?? "").includes(input)}
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? "")
          .toLowerCase()
          .localeCompare((optionB?.label ?? "").toLowerCase())
      }
      options={
        subCates &&
        subCates.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      }
      status={status}
    />
  );
};

export default SelectSubCategory;
