import { Empty, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import userApi from "./../../api/userApi";
import { useDispatch, useSelector } from "react-redux";
import {
  addTab,
  onChangeCustomerPhone,
} from "../../store/slices/createBillSlice";

const CustomerSelect = () => {
  const { activeKey } = useSelector((state) => state.createBill.tabState);
  const { tabItems } = useSelector((state) => state.createBill.tabState) || [];
  const dispatch = useDispatch();
  let customerPhone = "0";

  tabItems.map((item) => {
    if (item.key == activeKey) {
      customerPhone = item.customerPhone;
    }
  });

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
    // fetching data here
    fetchData(input, setData, setFetching);
  };
  const handleChange = async (value) => {
    dispatch(onChangeCustomerPhone(value));
  };

  return (
    <div className="customer_select">
      <Select
        size="small"
        showSearch
        placeholder="Khách hàng"
        optionFilterProp="children"
        style={{
          width: "100%",
        }}
        value={customerPhone}
        defaultActiveFirstOption={true}
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
    </div>
  );
};

async function fetchData(input, setData, setFetching) {
  setFetching(true);
  let data = [];

  let res = await userApi.getAllCustomer();
  if (res.isSuccess) {
    let listCus = res.customers.rows;
    console.log(listCus);
    listCus = listCus.filter((item) => item.phonenumber != "0");
    data = listCus.map((c) => {
      return {
        value: c.phonenumber,
        label: (
          <div>
            <div>{c.firstName + " " + c.lastName}</div>
            <div>{c.id + " - " + c.phonenumber}</div>
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
