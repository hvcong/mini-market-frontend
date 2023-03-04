import {
  Button,
  Pagination,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Category1Modal from "../../components/admin/modal/Category1Modal";

const dataSource = [];
for (let i = 1; i <= 10; i++) {
  dataSource.push({
    key: i,
    id: "CT-" + i,
    name: "Gia vị",
    image: "image",
    active: false,
  });
}

const Category1 = () => {
  const [isShowCateDetailModal, setIsShowCateDetailModal] = useState(false);
  const [modalType, setModalType] = useState("update");

  const columns = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (_, category) => (
        <Switch
          checkedChildren="On"
          unCheckedChildren="Off"
          defaultChecked={category.active}
        />
      ),
    },
    {
      title: "Hành động",
      align: "right",
      dataIndex: "actions",
      key: "actions",
      render: (_, category) => (
        <Space>
          <Tooltip placement="top" title={"Xem / chỉnh sửa"}>
            <Button
              size="small"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setModalType("update");
                setIsShowCateDetailModal(true);
              }}
            >
              Chi tiết
            </Button>
          </Tooltip>
          <Tooltip placement="top" title={"Xóa vĩnh viễn"}>
            <Button
              type="primary"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                // setIdSelected(product.id);
                // setTypeOfModal("update");
                // setIsShowDetailModal(true);
              }}
            >
              Xóa
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // pagination handle
  function onChangePageNumber() {}
  return (
    <div className="category1">
      <Table dataSource={dataSource} columns={columns} pagination={false} />
      <div
        style={{
          textAlign: "center",
          padding: 16,
        }}
      >
        <Pagination onChange={onChangePageNumber} total={100} />
      </div>
      <Category1Modal
        visible={isShowCateDetailModal}
        setVisible={setIsShowCateDetailModal}
        modalType={modalType}
      />
    </div>
  );
};

export default Category1;
