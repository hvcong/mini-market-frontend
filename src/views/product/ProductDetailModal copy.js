import React, { useRef, useState } from "react";
import UploadImageProduct from "../../components/admin/UploadImageProduct";
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
} from "antd";
import ModalCustomer from "../../components/ModalCustomer";
import { PlusOutlined } from "@ant-design/icons";
import SelectCategory from "../../components/product/SelectCategory";
import SelectSubCategory from "../../components/product/SelectSubCategory";
const { Text } = Typography;

const ProductDetailModal = ({ visible, setVisible, typeOfModal }) => {
  const [formState, setFormState] = useState({
    id: "",
    name: "",
    images: [
      "https://vinmec-prod.s3.amazonaws.com/images/20211218_114300_993458_an-tao-luc-nao-tot-.max-1800x1800.jpg",
      "https://vinmec-prod.s3.amazonaws.com/images/20211218_114300_993458_an-tao-luc-nao-tot-.max-1800x1800.jpg",
    ],
    description: "",
    quantity: 0,
    state: false,
    subCategoryId: "",
  });

  return (
    <>
      <ModalCustomer visible={visible} setVisible={setVisible}>
        <div>
          <Typography.Title level={4} className="title">
            {typeOfModal == "update"
              ? "Cập nhật thông tin sản phẩm"
              : "Thêm mới sản phẩm"}
          </Typography.Title>
          <div className="form__container">
            <Form size="small">
              <Row gutter={[48]}>
                <Col span={12}>
                  <Row gutter={[12, 12]}>
                    <Col span={6}>
                      <Text>Mã sản phẩm</Text>
                    </Col>
                    <Col span={15}>
                      <Input
                        className="input"
                        placeholder=" COCA03"
                        size="small"
                      />
                    </Col>
                    <Col span={6}>
                      <Text>Tên sản phẩm</Text>
                    </Col>
                    <Col span={15}>
                      <Input
                        className="input"
                        placeholder=" Cocacola 1,5 lit"
                        size="small"
                      />
                    </Col>
                    <Col span={6}>
                      <Text>Tồn kho</Text>
                    </Col>
                    <Col span={15}>
                      <InputNumber
                        size="small"
                        min={0}
                        defaultValue={0}
                        style={{ minWidth: "120px" }}
                      />
                    </Col>
                    <Col span={6}>
                      <Text>Giá nhập</Text>
                    </Col>
                    <Col span={15}>
                      <InputNumber
                        size="small"
                        min={0}
                        defaultValue={0}
                        style={{ minWidth: "120px" }}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col span={12}>
                  <Row gutter={[12, 12]}>
                    <Col span={8}>
                      <Text>Nhóm sản phẩm (cấp 1)</Text>
                    </Col>
                    <Col span={15}>
                      <SelectSubCategory />
                    </Col>
                    <Col span={8}>
                      <Text>Nhóm sản phẩm (cấp 2)</Text>
                    </Col>
                    <Col span={15}>
                      <SelectCategory />
                    </Col>
                    <Col span={8}>
                      <Text>Trạng thái</Text>
                    </Col>
                    <Col span={15}>
                      <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        defaultChecked
                      />
                    </Col>
                  </Row>
                </Col>

                <Col span={24}>
                  <p style={{ paddingBottom: "4px", paddingTop: "4px" }}>
                    Hình ảnh
                  </p>
                  <UploadImageProduct />
                </Col>
              </Row>
            </Form>
            <Space
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {typeOfModal == "create" ? (
                <>
                  <Button type="primary">Lưu & Thêm mới</Button>
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
    </>
  );
};

export default ProductDetailModal;
