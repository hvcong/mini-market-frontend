import { SearchOutlined } from "@ant-design/icons";
import { Empty, message, Select, Spin } from "antd";
import { useState } from "react";

const SearchProduct = ({ formState, ...props }) => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState();
  const [fetching, setFetching] = useState(false);
  const handleSearch = (input) => {
    // fetching data here
    fetchData(input, setData, setFetching);
  };
  const handleChange = async (productId) => {};

  return (
    <div>
      <Select
        showSearch
        value={input}
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
      <SearchOutlined
        style={{
          fontSize: "16px",
          color: "#888",
          position: "relative",
          left: "-24px",
        }}
      />
    </div>
  );
};

async function fetchData(input, setData, setFetching) {
  //console.log(input);
}

export default SearchProduct;
