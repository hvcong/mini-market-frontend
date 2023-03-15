import React, { useEffect, useRef, useState } from "react";

import {
  Modal,
  Button,
  Cascader,
  DatePicker,
  Form,
  Radio,
  Select,
  Switch,
  TreeSelect,
  Input,
  Row,
  Col,
  Typography,
  Space,
  InputNumber,
  Divider,
  Table,
} from "antd";
import ModalCustomer from "../ModalCustomer";
import {
  CloseOutlined,
  CloseSquareOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs, { isDayjs } from "dayjs";

import SelectCategory from "../product/SelectCategory";
import SelectSubCategory from "../product/SelectSubCategory";
import DropSelectColum from "../product/DropSelectColum";
import SearchProductInput from "../../components/price/SearchProductInput";
const { Text } = Typography;

const data = [];
for (let i = 1; i <= 10; i++) {
  data.push({
    key: i,
    id: "PR-" + i,
    title: "Bảng giá mùa xuân",
    startDate: "10/2/2022",
    endDate: "12/2/2022",
    acitve: i % 2 == 0,
  });
}

const BillCUModal = ({ visible, setVisible, typeOfModal }) => {
  const [formState, setFormState] = useState({
    id: "",
    title: "",
    time: {
      start: "",
      end: "",
    },
    state: true,
  });
  const [allColumns, setAllColumns] = useState([]);

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    let _dataSource = [...dataSource];
    _dataSource = _dataSource.map((item) => {
      return {
        ...item,
        startDate: formState.time.start,
        endDate: formState.time.end,
      };
    });
    setDataSource(_dataSource);

    let _allColumns = [
      {
        title: "Id",
        dataIndex: "id",
        width: 80,
        fixed: "left",
        fixedShow: true,
      },
      {
        title: "Mã SP",
        dataIndex: "productId",
        width: 100,
        fixed: "left",
        hidden: true,
      },
      {
        title: "Tên SP",
        dataIndex: "productName",
        width: 200,
        fixed: "left",
        fixedShow: true,
      },
      {
        title: "Giá nhập",
        dataIndex: "priceIn",
        fixedShow: true,
      },

      {
        title: "Thời gian áp dụng",
        dataIndex: "startDate",
        width: 240,
        render: (_, row) => (
          <div className="cellDateEditable">
            <DatePicker.RangePicker
              size="small"
              onChange={(value) => {
                onRowChangeTime(value, row);
              }}
              disabledDate={(current) => {
                // Can not select days before today and today
                if (
                  current &&
                  isDayjs(formState.time.start) &&
                  isDayjs(formState.time.end)
                ) {
                  return (
                    current < formState.time.start ||
                    current > formState.time.end
                  );
                }
              }}
              value={[
                isDayjs(row.startDate) && row.startDate,
                isDayjs(row.endDate) && row.endDate,
              ]}
            />
          </div>
        ),
      },
      {
        title: "Trạng thái",
        width: 80,
        dataIndex: "active",
        render: (_, price) => (
          <Switch
            checkedChildren="On"
            unCheckedChildren="Off"
            defaultChecked={price.acitve}
          />
        ),
      },
      {
        title: "Giá bán",
        dataIndex: "price",
        fixedShow: true,
        fixed: "right",
        render: (_, product) => <Input placeholder="0"></Input>,
      },
    ];

    if (typeOfModal != "update") {
      _allColumns.unshift({
        title: <CloseSquareOutlined />,
        width: 32,
        fixed: "left",
        fixedShow: true,
        render: (_, price) => (
          <CloseOutlined
            onClick={() => {
              let _dataSource = [...dataSource];
              _dataSource = _dataSource.map((item) => {
                if (item.id == price.id) {
                  item.id = "0000";
                }
                return item;
              });

              _dataSource = _dataSource.filter((item) => item.id != "0000");
              setDataSource(_dataSource);
            }}
          />
        ),
      });
    }

    setAllColumns(_allColumns);

    return () => {};
  }, [formState.time, typeOfModal]);

  useEffect(() => {
    setDataSource(data);
    return () => {};
  }, []);

  // on row change time
  function onRowChangeTime(value, row) {
    let _dataSource = [...dataSource];
    _dataSource = _dataSource.map((item) => {
      if (item.id == row.id) {
        item.startDate = value[0];
        item.endDate = value[1];
        return item;
      } else {
        item.startDate = formState.time.start;
        item.endDate = formState.time.end;
        return item;
      }
    });

    _dataSource = _dataSource.filter((item) => true);

    setDataSource(_dataSource);
  }

  //table handle render

  return (
    <div className="price__modal">
      <ModalCustomer visible={visible} setVisible={setVisible}>
        <div>
          <div className="title__container">
            <Typography.Title level={4} className="title">
              {typeOfModal == "update"
                ? "Cập nhật thông tin bảng giá"
                : "Thêm mới bảng giá"}
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="infor__input">
              <div className="input__container">
                <Text className="input__label">Mã</Text>
                <Input
                  placeholder="Mã"
                  size="small"
                  style={{
                    width: "150px",
                  }}
                  value={formState.id}
                  onChange={({ target }) =>
                    setFormState({ ...formState, id: target.value })
                  }
                />
              </div>
              <div className="input__container">
                <Text className="input__label">Tên</Text>
                <Input
                  placeholder="Tên"
                  size="small"
                  style={{
                    width: "300px",
                  }}
                  value={formState.title}
                  onChange={({ target }) =>
                    setFormState({ ...formState, title: target.value })
                  }
                />
              </div>
              <div className="input__container">
                <Text className="input__label">Thời gian</Text>
                <DatePicker.RangePicker
                  size="small"
                  value={[formState.time.start, formState.time.end]}
                  onChange={(value) => {
                    setFormState({
                      ...formState,
                      time: {
                        start: value[0],
                        end: value[1],
                      },
                    });
                  }}
                />
              </div>
              <div className="input__container">
                <Text className="input__label">Trạng thái</Text>
                <Switch
                  checkedChildren="On"
                  unCheckedChildren="Off"
                  checked={formState.state}
                  onChange={(is) =>
                    setFormState({
                      ...formState,
                      state: is,
                    })
                  }
                />
              </div>
            </div>

            <div className="table__header">
              <div className="left">
                <Typography.Title
                  level={5}
                  style={{
                    margin: 0,
                  }}
                >
                  Danh sách sản phẩm{" "}
                </Typography.Title>
                <div className="search__container">
                  <SearchProductInput
                    placeholder="Thêm sản phẩm vào bảng giá"
                    style={{
                      width: "280px",
                    }}
                  />
                </div>
              </div>

              <div className="btn__item">
                <DropSelectColum
                  allColumns={allColumns}
                  setAllColumns={setAllColumns}
                />
              </div>
            </div>
            <Table
              columns={allColumns.filter((col) => !col.hidden)}
              dataSource={dataSource}
              pagination={false}
              size="small"
              scroll={{
                x: allColumns.filter((item) => !item.hidden).length * 150,
                y: window.innerHeight * 0.5,
              }}
              className="table"
            />

            <Space
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {typeOfModal == "create" ? (
                <>
                  <Button type="primary">Lưu & Đóng</Button>
                </>
              ) : (
                <Button type="primary">Cập nhật</Button>
              )}
              <Button type="primary" danger onClick={() => setVisible(false)}>
                Hủy bỏ
              </Button>
            </Space>
          </div>
        </div>
      </ModalCustomer>
    </div>
  );
};

export default BillCUModal;
