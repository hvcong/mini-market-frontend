import React, { useState } from "react";
import UploadImageProduct from "../UploadImageProduct";
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
} from "antd";
const { Text } = Typography;

const options = [];
for (let i = 10; i < 36; i++) {
  options.push({
    label: "Thùng 24 ",
    value: i,
  });
}
const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const ProductDetailModal = ({ visible, setVisible, typeOfModal }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Modal
        title={
          typeOfModal == "update" ? "Chi tiết sản phẩm" : "Thêm mới sản phẩm"
        }
        open={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={"80%"}
        footer={false}
        style={{
          top: 24,
        }}
      >
        <div className="form__add--product">
          <Form layout="horizontal" labelCol={{ span: 4 }}>
            <Form.Item label="Mã sản phẩm">
              <Input className="input" />
            </Form.Item>

            <Form.Item label="Tên sản phẩm">
              <Input className="input" />
            </Form.Item>

            <Form.Item label="Loại sản phẩm (cấp 1)">
              <Select placeholder={"--Loại sản phẩm cấp 1 --"}>
                <Select.Option value="demo1">Nước giải khát</Select.Option>
                <Select.Option value="demo2">Thịt</Select.Option>
                <Select.Option value="demo3">Gia vị</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Loại sản phẩm (cấp 2)">
              <Select placeholder={"--Loại sản phẩm cấp 2 --"}>
                <Select.Option value="demo4">Nước mắm</Select.Option>
                <Select.Option value="demo5">Nước có ga</Select.Option>
                <Select.Option value="demo6">Nước không có ga</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Hình ảnh">
              <UploadImageProduct />
            </Form.Item>

            <Form.Item label="Số lượng">
              <Input className="input" />
            </Form.Item>
            <Form.Item label="Đơn vị tính">
              <Select
                mode="multiple"
                allowClear
                placeholder="--Nhiều đơn vị tính--"
                onChange={handleChange}
                options={options}
              />
            </Form.Item>
          </Form>
          <Space
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button type="primary" danger>
              Hủy bỏ
            </Button>
            <Button type="primary">Hoàn tất</Button>
          </Space>
        </div>
      </Modal>
    </>
  );
};

export default ProductDetailModal;
