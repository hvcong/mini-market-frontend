import { DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import React from "react";
import ListProductItem from "./ListProductItem";

const ListProduct = () => {
  return (
    <div className="list_product">
      <ListProductItem />
      <ListProductItem />
      <ListProductItem />
      <ListProductItem />
    </div>
  );
};

export default ListProduct;
