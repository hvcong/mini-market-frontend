import React from "react";
import { Button, Form, Input, Modal, Space, Switch } from "antd";
import UploadImageCategory1 from "../UploadImageCategory1";

const Category1Modal = ({ visible, setVisible, modalType }) => {
  function handleCancel() {
    setVisible(false);
  }

  return (
    <>
      <Modal
        title={
          modalType == "update" ? "Chi tiết danh mục" : "Thêm mới danh mục"
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

            <Form.Item label="Tên danh  mục">
              <Input />
            </Form.Item>
            <Form.Item label="Hình ảnh">
              <UploadImageCategory1 />
            </Form.Item>
            <Form.Item label="Trạng thái hoạt động">
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
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

export default Category1Modal;
