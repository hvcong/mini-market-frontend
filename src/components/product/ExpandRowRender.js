import { EditOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Image,
  Pagination,
  Row,
  Space,
  Table,
  Tabs,
  Typography,
} from "antd";
import React, { useState } from "react";
import { render } from "@testing-library/react";

const ExpandRowRender = ({ rowData, modalState, setModalState }) => {
  const onChange = (key) => {
    console.log(key);
  };

  console.log(rowData);
  const [imageIndexActive, setImageIndexActive] = useState(0);

  const items = [
    {
      label: "Thông tin",
      key: 1,
      children: renderInforDetail(),
    },
    {
      label: "Biến động kho",
      key: 2,
      children: renderStoreTransaction(),
    },
  ];

  function renderInforDetail() {
    return (
      <>
        <div className="inforDetail">
          <div className="infor__header">
            <Typography.Title level={3}>{rowData.name}</Typography.Title>
            <div className="btns">
              <Space>
                <Button
                  size="small"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setModalState({
                      type: "update",
                      rowSelected: rowData,
                      visible: true,
                    });
                  }}
                >
                  Cập nhật
                </Button>
                {rowData.state ? (
                  <Button
                    size="small"
                    type="primary"
                    icon={<LockOutlined />}
                    danger
                  >
                    Ngừng kinh doanh
                  </Button>
                ) : (
                  <Button size="small" type="primary" icon={<UnlockOutlined />}>
                    Mở kinh doanh
                  </Button>
                )}
              </Space>
            </div>
          </div>
          <Row>
            <Col span={8}>
              <Image.PreviewGroup>
                <div className="images">
                  <div className="image__show">
                    <Image
                      width={200}
                      src={
                        rowData.images &&
                        rowData.images.length > 0 &&
                        rowData.images[imageIndexActive].uri
                      }
                    />
                  </div>
                  <div className="images__list">
                    {rowData.images &&
                      rowData.images.map((image, index) => (
                        <div
                          className={
                            index == imageIndexActive
                              ? "image__item active"
                              : "image__item"
                          }
                          onClick={() => {
                            setImageIndexActive(index);
                          }}
                        >
                          <Image width={40} src={image.uri} />
                        </div>
                      ))}
                  </div>
                </div>
              </Image.PreviewGroup>
            </Col>
            <Col span={16}>
              <div className="infor__item">
                <div className="label">Mã sản phẩm:</div>
                <div className="value">{rowData.id}</div>
              </div>
              <div className="infor__item">
                <div className="label">Tên sản phẩm :</div>
                <div className="value">{rowData.name}</div>
              </div>
              <div className="infor__item">
                <div className="label">Nhóm hàng:</div>
                <div className="value">
                  {rowData.SubCategory && rowData.SubCategory.name + "/ ??? "}
                </div>
              </div>
              <div className="infor__item">
                <div className="label">Các đơn vị tính:</div>
                <div className="value">
                  ????????????????????????????????????
                </div>
              </div>
              <div className="infor__item">
                <div className="label">Giá vốn:</div>
                <div className="value">???????????????????????</div>
              </div>
              <div className="infor__item">
                <div className="label">Tồn kho:</div>
                <div className="value">{rowData.quantity}</div>
              </div>
              <div className="infor__item">
                <div className="label">Trạng thái:</div>
                <div className="value">
                  {rowData.state ? "Đang kinh doanh" : "Đã ngưng kinh doanh"}
                </div>
              </div>
              <div className="infor__item">
                <div className="label">Mô tả:</div>
                <div className="value">{rowData.description}</div>
              </div>
            </Col>
          </Row>
        </div>
      </>
    );
  }

  function renderStoreTransaction() {
    const columns = [
      {
        title: "Mã chứng từ",
        dataIndex: "id",
        render: (_, data) => <a>{data.id}</a>,
      },
      {
        title: "Phương thức",
        dataIndex: "type",
      },
      {
        title: "Thời gian",
        dataIndex: "createAt",
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
      },
      {
        title: "Giá vốn",
        dataIndex: "priceIn",
      },
      {
        title: "Tồn hàng cuối",
        dataIndex: "remainingQuantity",
      },
    ];

    const dataSource = new Array(6).fill(null).map((item, index) => ({
      key: index,
      id: "id",
      type: "Cập nhật",
      createAt: "10h5p- 5/4/2022",
      quantity: index + 1,
      priceIn: index * 1000,
      remainingQuantity: index + 10,
    }));

    // pagination handle
    function onChangePageNumber(pageNumber, pageSize) {
      console.log(pageNumber, ",", pageSize);
    }

    return (
      <div className="store__stransaction-product">
        <Table dataSource={dataSource} columns={columns} pagination={false} />
        <div className="pagination__container">
          <Pagination
            onChange={onChangePageNumber}
            total={24}
            defaultPageSize={6}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="expand__render">
      <Tabs
        onChange={onChange}
        type="card"
        items={items}
        defaultActiveKey={1}
      />
    </div>
  );
};

export default ExpandRowRender;
