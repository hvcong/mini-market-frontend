import {
  Button,
  Col,
  Dropdown,
  Row,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useState } from "react";
import {
  DeleteOutlined,
  DeleteRowOutlined,
  EditOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import Category2Modal from "../../components/admin/modal/Category2Modal";
const { Text } = Typography;

const dataSource = [];
for (let i = 1; i <= 10; i++) {
  dataSource.push({
    key: i,
    id: "SCT-" + i,
    name: "Nước mắm",
    active: false,
  });
}

const Category2 = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isShowCateDetailModal, setIsShowCateDetailModal] = useState(false);
  const [modalType, setModalType] = useState("update");
  const hasSelected = selectedRowKeys.length > 0;

  //table handle
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
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
          defaultChecked={category.acitve}
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

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // selected table actions handle
  const onMenuClick = (e) => {
    console.log(e.key);
  };

  const data = [];
  for (let i = 1; i <= 10; i++) {
    data.push({
      key: i,
      id: i,
      name: "product name",
      quantity: 10,
      price: "100.000 đ ",
      unitType: "Lon",
      category: "Nước",
      subCategory: "Nước có ga",
      acitve: true,
    });
  }

  const items = [
    {
      key: "1",
      label: (
        <Button
          icon={<DeleteOutlined />}
          danger
          size="small"
          style={{
            width: "100%",
            textAlign: "left",
          }}
        >
          Xóa {selectedRowKeys.length} sp
        </Button>
      ),
    },
    {
      key: "2",
      label: (
        <Button icon={<StopOutlined />} size="small">
          Tạm dừng bán {selectedRowKeys.length} sp
        </Button>
      ),
    },
  ];
  return (
    <div className="category2">
      <Row
        style={{
          paddingBottom: 16,
          paddingTop: 16,
        }}
      >
        <Col span={16}>
          {hasSelected && (
            <Space>
              <Dropdown.Button
                type="primary"
                menu={{ items, onClick: onMenuClick }}
                placement="bottomLeft"
              >
                <Text
                  strong
                  style={{
                    color: "white",
                  }}
                >
                  Đã chọn {selectedRowKeys.length}
                </Text>
              </Dropdown.Button>
            </Space>
          )}
        </Col>
        <Col
          span={8}
          style={{
            textAlign: "right",
            paddingRight: "16px",
          }}
        >
          <Space>
            <Button
              onClick={() => {
                // setTypeOfModal("add");
                // setIsShowDetailModal(true);
              }}
              icon={<PlusOutlined />}
            >
              Thêm mới
            </Button>
          </Space>
        </Col>
      </Row>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowSelection={rowSelection}
        bordered
      />
      ;
      <Category2Modal
        visible={isShowCateDetailModal}
        setVisible={setIsShowCateDetailModal}
        modalType={modalType}
      />
    </div>
  );
};

export default Category2;
