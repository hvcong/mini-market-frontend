import { DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, Tag, Typography } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import {
  addOneProductToActiveTab,
  removeOneProductLine,
  updateQuantityOneProduct,
} from "../../../store/slices/createBillSlice";
const ListProductItem = ({ data, index }) => {
  const dispatch = useDispatch();
  let product = data.ProductUnitType.Product;
  let unitType = data.ProductUnitType.UnitType;

  return (
    <div className="list_product_item">
      <div className="index">{index}</div>
      <div className="delete_icon">
        <Button
          size="small"
          icon={<DeleteOutlined />}
          danger
          onClick={() => {
            dispatch(removeOneProductLine({ id: data.id }));
          }}
        />
      </div>
      <div className="product_id">
        <Typography.Link>{product.id}</Typography.Link>
      </div>
      <div className="product_name">{product.name}</div>
      <div className="product_unit">
        <Tag color="green">{unitType.name}</Tag>
      </div>
      <div className="quantity_container">
        <InputNumber
          className="value"
          size="small"
          min={1}
          value={data.quantity}
          onChange={(value) => {
            let newValue = value;
            if (value == null || value == 0) {
              newValue = 1;
            }

            dispatch(
              updateQuantityOneProduct({
                id: data.id,
                quantity: newValue,
              })
            );
          }}
        />
      </div>
      <div className="price">{data.price}vnđ</div>
      <div className="sum_price">
        {data.quantity && Number(data.quantity) * Number(data.price)} vnđ
      </div>
    </div>
  );
};

export default ListProductItem;
