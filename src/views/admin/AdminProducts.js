import {
  Button,
  Col,
  Dropdown,
  message,
  Pagination,
  Row,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
} from "antd";
import {
  MoreOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  HolderOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import ProductDetailModal from "../../components/admin/modal/ProductDetailModal";
import { useOutletContext, useParams } from "react-router-dom";
const { Text } = Typography;

const AdminProducts = ({ sidenavProps }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const [typeOfModal, setTypeOfModal] = useState("update");
  const hasSelected = selectedRowKeys.length > 0;

  const onMenuClick = (e) => {
    console.log(e.key);
  };

  const dataSource = [];
  for (let i = 1; i <= 10; i++) {
    dataSource.push({
      key: i,
      id: "SP-" + i,
      name: "Nước mắm Nam Ngư",
      quantity: 10,
      price: "100.000 đ ",
      unitType: "Chai",
      category: "Nước mắm/Gia vị",
      acitve: true,
    });
  }

  const items = [
    {
      key: "1",
      label: (
        <Button icon={<DeleteOutlined />} danger size="small">
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

  //table handle render
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
    },
    {
      title: "Tên",
      dataIndex: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    ,
    {
      title: "Đơn vị tính",
      dataIndex: "unitType",
    },
    ,
    {
      title: "Danh mục",
      dataIndex: "category",
    },
    {
      title: "Đơn giá hiện tại",
      dataIndex: "price",
      className: "colum-money",
      align: "right",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      render: (_, product) => (
        <Switch
          checkedChildren="On"
          unCheckedChildren="Off"
          defaultChecked={product.acitve}
        />
      ),
    },
    {
      title: "Hành động",
      dataIndex: "actions",
      render: (_, product) => (
        <Space>
          <Tooltip placement="top" title={"Xem / chỉnh sửa"}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setIdSelected(product.id);
                setTypeOfModal("update");
                setIsShowDetailModal(true);
              }}
            >
              Chi tiết
            </Button>
          </Tooltip>
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => {
              message.error("Xóa");
            }}
          >
            Xóa
          </Button>
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

  // pagination handle
  function onChangePageNumber(pageNumber, pageSize) {
    console.log(pageNumber, ",", pageSize);
  }

  return (
    <div className="products">
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
                setTypeOfModal("add");
                setIsShowDetailModal(true);
              }}
              icon={<PlusOutlined />}
            >
              Thêm mới
            </Button>
          </Space>
        </Col>
      </Row>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
      />
      <div className="pagination__container">
        <Pagination onChange={onChangePageNumber} total={100} />
      </div>
      <ProductDetailModal
        visible={isShowDetailModal}
        setVisible={() => {
          setIsShowDetailModal(false);
          setIdSelected(null);
        }}
        idSelected={idSelected}
        typeOfModal={typeOfModal}
      />
    </div>
  );
};

export default AdminProducts;
