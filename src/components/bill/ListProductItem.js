import { DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { Input, InputNumber, Tag, Typography } from "antd";
import React from "react";
const ListProductItem = () => {
  return (
    <div className="list_product_item">
      <div className="index">1</div>
      <div className="delete_icon">
        <DeleteOutlined />
      </div>
      <div className="product_id">sp005</div>
      <div className="product_name">
        <Typography.Link>Sữa tắm Palmolive xanh lá</Typography.Link>
      </div>
      <div className="product_unit">
        <Tag color="green">Lon</Tag>
      </div>
      <div className="quantity_container">
        <InputNumber className="value" size="small" defaultValue={1} min={1} />
      </div>
      <div className="price"> 12.000</div>
      <div className="sum_price">300.000</div>
    </div>
  );
};

export default ListProductItem;
