import { Button, Empty, Select, Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import userApi from "../../../api/userApi";
import { useDispatch, useSelector } from "react-redux";
import {
  addTab,
  onChangeCustomerPhone,
} from "../../../store/slices/createBillSlice";
import HighlightedText from "../../HighlightedText";
import { PlusOutlined } from "@ant-design/icons";

const CustomerSelect = ({ style }) => {
  const { activeKey } = useSelector((state) => state.createBill.tabState);
  const { tabItems } = useSelector((state) => state.createBill.tabState) || [];
  let customerPhone = "0";
  tabItems.map((item) => {
    if (item.key == activeKey) {
      customerPhone = item.customerPhone;
    }
  });

  const dispatch = useDispatch();

  const [data, setData] = useState([
    {
      value: "0",
      label: (
        <div>
          <div>Khách lẻ</div>
          {/* <div>{c.id}</div> */}
        </div>
      ),
    },
  ]);
  const [input, setInput] = useState();
  const [fetching, setFetching] = useState(false);

  const handleSearch = (input) => {
    setInput(input);

    // fetching data here
    fetchData(input, setData, setFetching);
  };
  const handleChange = async (value) => {
    setInput(value);
    dispatch(onChangeCustomerPhone(value));
  };

  return (
    <div
      className="customer_select"
      style={{
        display: "flex",
      }}
    >
      <Select
        size="small"
        showSearch
        placeholder="Khách hàng"
        optionFilterProp="children"
        style={{
          width: "160px",
        }}
        value={customerPhone}
        defaultActiveFirstOption
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={
          fetching ? (
            <Spin size="small" />
          ) : (
            <div
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Empty />
            </div>
          )
        }
        options={(data || []).map((item) => ({
          value: item.value,
          label: item.label,
        }))}
      />
      {/* <div className="add_new_customer">
        {customerPhone && customerPhone.length == 10 && (
          <Tag
            color="green"
            style={{
              marginLeft: 12,
              marginTop: 1,
            }}
          >
            KH mới
          </Tag>
        )}
      </div> */}
    </div>
  );
};

async function fetchData(input, setData, setFetching) {
  setFetching(true);
  let data = [];
  console.log(input);

  let res = await userApi.getAllCustomerLikePhone(input);
  if (res.isSuccess) {
    let listCus = res.customers;
    listCus = listCus.filter((item) => item.phonenumber != "0");
    data = listCus.map((c) => {
      let name = (c.firstName || "") + " " + (c.lastName || "");

      return {
        value: c.phonenumber,
        label: (
          <div>
            <div>{name}</div>
            <div
              style={{
                display: "flex",
              }}
            >
              <HighlightedText text={c.phonenumber} highlightText={input} />
            </div>
          </div>
        ),
      };
    });
    data.unshift({
      value: "0",
      label: (
        <div>
          <div>Khách lẻ</div>
          {/* <div>{c.id}</div> */}
        </div>
      ),
    });
  }
  setData(data);
  setFetching(false);
}

export default CustomerSelect;
