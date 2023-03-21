import { SearchOutlined } from "@ant-design/icons";
import { Empty, message, Select, Spin, Tag, Typography } from "antd";
import { useState } from "react";
import HighlightedText from "../HighlightedText";
import productApi from "./../../api/productApi";

const ProductIdIInputSearchSelect = ({
  formState,
  addProductToRow,
  index,
  ...props
}) => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState();
  const [fetching, setFetching] = useState(false);
  const handleSearch = (input) => {
    // fetching data here
    fetchData(input, setData, setFetching);
  };
  const handleChange = async (productId) => {
    setInput(productId);
    addProductToRow(productId, index);
  };

  return (
    <div>
      <Select
        showSearch
        value={input}
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
          label: (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <div>
                <img
                  src={
                    (p.images && p.images.length > 0 && p.images[0].uri) ||
                    "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  }
                  style={{
                    width: "32px",
                    height: "32px",
                  }}
                  alt="alt"
                />
              </div>
              <div
                style={{
                  paddingLeft: "8px",
                  paddingBottom: "12px",
                }}
              >
                {p.name}
                <div
                  style={{
                    fontSize: "12px",
                  }}
                >
                  <HighlightedText text={p.id} highlightText={input} />
                </div>
              </div>
            </div>
          ),
        };
      });
      setData(_dataTable);
    }
  }
}

export default ProductIdIInputSearchSelect;
