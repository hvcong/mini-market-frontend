import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Select, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import cateApi from "../../api/cateApi";
import { setCates } from "../../store/slices/cateSlice";
import CategoryDetailModal from "./../category/CategoryDetailModal";

const SelectCategory = ({
  idSelected,
  status,
  setIdCategorySelected,
  ...props
}) => {
  const { categories = [], refresh } = useSelector((state) => state.cate);
  const dispatch = useDispatch();

  const [cateModalState, setCateModalState] = useState({
    type: "create",
    visible: false,
  });

  useEffect(() => {
    getAllActiveCategory();

    return () => {};
  }, []);
  async function getAllActiveCategory() {
    let res = await cateApi.getMany();
    if (res.isSuccess) {
      console.log(res);
      dispatch(setCates(res.cates));
    }
  }

  useEffect(() => {
    if (refresh) {
      getAllActiveCategory();
    }
    return () => {};
  }, [refresh]);

  function onAddNew() {
    setCateModalState({
      visible: true,
      type: "create",
    });
  }

  return (
    <>
      <Select
        {...props}
        style={{
          width: "100%",
        }}
        placeholder="--Nhóm sản phẩm (cấp 1) --"
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
        onChange={setIdCategorySelected}
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? "").includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? "")
            .toLowerCase()
            .localeCompare((optionB?.label ?? "").toLowerCase())
        }
        options={categories
          .filter((item) => {
            if (item.id == idSelected) {
              return true;
            }

            if (item.state) {
              return true;
            }
          })
          .map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          })}
        status={status}
      />
      <CategoryDetailModal
        modalState={cateModalState}
        setModalState={setCateModalState}
      />
    </>
  );
};

export default SelectCategory;
