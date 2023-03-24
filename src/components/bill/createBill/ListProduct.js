import { DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import React from "react";
import ListProductItem from "./ListProductItem";
import { useDispatch, useSelector } from "react-redux";
import { addOneProductToActiveTab } from "../../../store/slices/createBillSlice";
import { Empty, message } from "antd";

const ListProduct = () => {
  const { activeKey } = useSelector((state) => state.createBill.tabState);
  const list =
    useSelector((state) => state.createBill.listState[activeKey]) || [];
  const dispatch = useDispatch();

  return (
    <div className="list_product">
      {list &&
        list.map((item, index) => {
          return <ListProductItem data={item} index={index} key={index} />;
        })}

      {list.length == 0 && <Empty description={false} />}
    </div>
  );
};

export default ListProduct;
