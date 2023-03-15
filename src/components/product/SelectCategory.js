import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Select, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import cateApi from "../../api/cateApi";
import { setCates } from "../../store/slices/cateSlice";

const SelectCategory = ({ idSelected, status, setIdCategorySelected }) => {
  const cate = useSelector((state) => state.cate);
  const dispatch = useDispatch();
  let { categories = [] } = cate;

  useEffect(() => {
    getAllActiveCategory();

    async function getAllActiveCategory() {
      let res = await cateApi.getMany();
      console.log(res);
      if (res.isSuccess) {
        dispatch(setCates(res.cates));
      }
    }
    return () => {};
  }, []);

  const [name, setName] = useState("");
  const inputRef = useRef(null);

  const onNameChange = (event) => {
    setName(event.target.value);
    console.log("here");
  };

  function onAddNew() {}

  return (
    <Select
      style={{
        width: "100%",
      }}
      placeholder="--Nhóm sản phẩm (cấp 2) --"
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
            <Input
              placeholder="Thêm mới"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
            />
            <Button type="text" icon={<PlusOutlined />} onClick={onAddNew}>
              Thêm
            </Button>
          </Space>
        </>
      )}
      value={idSelected}
      onChange={setIdCategorySelected}
      showSearch
      optionFilterProp="children"
      filterOption={(input, option) => (option?.label ?? "").includes(input)}
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? "")
          .toLowerCase()
          .localeCompare((optionB?.label ?? "").toLowerCase())
      }
      options={categories.map((item) => ({
        label: item.name,
        value: item.id,
      }))}
      status={status}
    />
  );
};

export default SelectCategory;
