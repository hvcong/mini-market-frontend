import React from "react";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
} from "antd";
import UploadImageCategory1 from "../UploadImageCategory1";
import { DeleteOutlined } from "@ant-design/icons";

const Category2Modal = ({ visible, setVisible, modalType }) => {
  function handleCancel() {
    setVisible(false);
  }

  return (
    <>
      <Modal
        title={
          modalType == "update"
            ? "Chi tiết danh mục cấp 2"
            : "Thêm mới danh mục cấp 2"
        }
        open={visible}
        onCancel={handleCancel}
        footer={false}
        width="90%"
        style={{
          top: 24,
        }}
      >
        <div className="category1__modal">
          <Form layout="horizontal" labelCol={{ span: 4 }}>
            <Form.Item label="Mã danh mục">
              <Input />
            </Form.Item>

            <Form.Item label="Tên danh mục">
              <Input />
            </Form.Item>
            <Form.Item label="Thuộc danh mục cấp 1">
              <Select placeholder={"--Thuộc danh mục cấp 1 --"}>
                <Select.Option value="demo1">Thịt</Select.Option>
                <Select.Option value="demo2">Nước giải khát</Select.Option>
                <Select.Option value="demo3">Gia vị</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Trạng thái">
              <Switch
                checkedChildren="On"
                unCheckedChildren="Off"
                defaultChecked
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
            {modalType == "update" ? (
              <>
                <Button type="primary" danger>
                  Trở về
                </Button>
                <Button type="primary">Lưu thay đổi</Button>
              </>
            ) : (
              <>
                <Button type="primary" danger>
                  Hủy bỏ
                </Button>
                <Button type="primary">Hoàn tất</Button>
              </>
            )}
          </Space>
        </div>
      </Modal>
    </>
  );
};

export default Category2Modal;
