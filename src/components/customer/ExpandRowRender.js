import { EditOutlined, LockOutlined } from "@ant-design/icons";
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
import React from "react";
import { render } from "@testing-library/react";

const ExpandRowRender = ({ rowData, setIsShowDetailModal }) => {
  const onChange = (key) => {
    //console.log(key);
  };

  const items = [
    {
      label: "Thông tin",
      key: 1,
      children: renderInforDetail(),
    },
    {
      label: "Lịch sử mua hàng",
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
                  onClick={() => setIsShowDetailModal(true)}
                >
                  Cập nhật
                </Button>
                {/* <Button
                  size="small"
                  type="primary"
                  icon={<LockOutlined />}
                  danger
                >
                  Ngừng kinh doanh
                </Button> */}
              </Space>
            </div>
          </div>
          <Row>
            <Col span={12}>
              <div className="infor__item">
                <div className="label">Mã khách hàng:</div>
                <div className="value">232323232</div>
              </div>
              <div className="infor__item">
                <div className="label">Tên khách hàng :</div>
                <div className="value">Hoàng Văn Công</div>
              </div>
              <div className="infor__item">
                <div className="label">Số điện thoại:</div>
                <div className="value">232323232</div>
              </div>
              <div className="infor__item">
                <div className="label">Email:</div>
                <div className="value">hvcong101201@gmail.com</div>
              </div>
              <div className="infor__item">
                <div className="label">Hạng mua hàng:</div>
                <div className="value">Đồng</div>
              </div>
              <div className="infor__item">
                <div className="label">Đia chỉ:</div>
                <div className="value">Thạch điền / Thạch Hà / Hà Tĩnh</div>
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
        title: "Mã hóa đơn",
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
        title: "Tổng tiền",
        dataIndex: "quantity",
      },
      {
        title: "Trạng thái",
        dataIndex: "retreiveBill", // trả hàng hay thành công
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
      //console.log(pageNumber, ",", pageSize);
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
