import { EditOutlined, LockOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Image,
  Pagination,
  Row,
  Space,
  Switch,
  Table,
  Tabs,
  Typography,
} from "antd";
import React from "react";
import { render } from "@testing-library/react";

const ExpandRowRender = ({ rowData, modalState, setModalState }) => {
  const { SubCategories = [] } = rowData;
  const onChange = (key) => {
    console.log(key);
  };

  const items = [
    {
      label: "Các nhóm cấp 2",
      key: 1,
      children: renderTableSub(),
    },
  ];

  function renderTableSub() {
    const columns = [
      {
        title: "Mã nhóm (c2)",
        dataIndex: "id",
      },
      {
        title: "Tên nhóm (c2)",
        dataIndex: "name",
        key: "name",
        fixed: "left",
        fixedShow: true,
      },
      {
        title: "Trạng thái",
        dataIndex: "state",
        key: "state",
        width: 80,
        render: (_, subCate) => (
          <Switch
            checkedChildren="On"
            unCheckedChildren="Off"
            checked={subCate.state}
            disabled
          />
        ),
      },
    ];

    // pagination handle
    function onChangePageNumber(pageNumber, pageSize) {
      console.log(pageNumber, ",", pageSize);
    }

    return (
      <div className="store__stransaction-product">
        <div
          className="infor__header"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <div className="btns">
            <Space>
              <Button
                size="small"
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setModalState({
                    ...modalState,
                    visible: true,
                    rowSelected: rowData,
                    type: "update",
                  });
                }}
              >
                Cập nhật
              </Button>
              <Button
                size="small"
                type="primary"
                icon={<LockOutlined />}
                danger
              >
                Ngừng kinh doanh
              </Button>
            </Space>
          </div>
        </div>
        <Table
          dataSource={SubCategories}
          columns={columns}
          pagination={false}
        />
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
