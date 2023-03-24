import { SearchOutlined } from "@ant-design/icons";
import { Empty, message, Select, Spin, Tag, Typography } from "antd";
import { useState } from "react";
import HighlightedText from "../HighlightedText";
import productApi from "./../../api/productApi";

const ProductIdIInputSearchSelect = ({ onChange, ...props }) => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState();
  const [fetching, setFetching] = useState(false);
  const handleSearch = (input) => {
    // fetching data here
    fetchData(input, setData, setFetching);
  };
  const handleChange = (value) => {
    setInput("");
    onChange(value);
  };

  return (
    <div>
      <Select
        {...props}
        showSearch
        allowClear
        placeholder={props.placeholder}
        style={props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        onClick={() => handleSearch()}
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
      {/* <SearchOutlined
        style={{
          fontSize: "16px",
          color: "#888",
          position: "relative",
          left: "-24px",
        }}
      /> */}
    </div>
  );
};

async function fetchData(input, setData, setFetching) {
  if (input) {
    let res = await productApi.findManyById(input);
    if (res.isSuccess) {
      let products = res.products || [];

      let _dataTable = products.map((p) => {
        return {
          value: p.id,
          label: p.id,
        };
      });
      setData(_dataTable);
    }
  }
}

export default ProductIdIInputSearchSelect;
