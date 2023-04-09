import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Select, Space } from "antd";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryDetailModal from "./../category/CategoryDetailModal";

let index = 0;

const SelectSubCategory = ({
  status,
  setIdSubCateSelected,
  idCategorySelected,
  idSelected,
  ...props
}) => {
  const cate = useSelector((state) => state.cate);
  const dispatch = useDispatch();
  let { categories = [] } = cate;

  let subCates = [];
  let category = null;
  categories.forEach((ca) => {
    if (ca.id == idCategorySelected) {
      subCates = ca.SubCategories;
      category = ca;
    }
  });

  const [cateModalState, setCateModalState] = useState({
    type: "create",
    visible: false,
  });

  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };

  function onAddNew() {
    setCateModalState({
      type: "update",
      visible: true,
      rowSelected: category,
    });
  }

  return (
    <>
      <Select
        {...props}
        style={{
          width: "100%",
        }}
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
      <CategoryDetailModal
        modalState={cateModalState}
        setModalState={setCateModalState}
      />
    </>
  );
};

export default SelectSubCategory;
