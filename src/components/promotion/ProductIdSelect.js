import { SearchOutlined } from "@ant-design/icons";
import { Empty, Input, message, Select, Spin } from "antd";
import { useState } from "react";
import HighlightedText from "../HighlightedText";
import productApi from "./../../api/productApi";

const ProductIdSelect = ({ value, onChange, ...props }) => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState();
  const [fetching, setFetching] = useState(false);
  const handleSearch = (input) => {
    // fetching data here
    fetchData(input, setData, setFetching);
  };

  function handleChange(value) {
    onChange(value);
    setInput("");
  }

  return (
    <Select
      {...props}
      onChange={handleChange}
      showSearch
      value={value}
      placeholder={props.placeholder}
      style={props.style}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onClick={() => {
        handleSearch();
      }}
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
  );
};

async function fetchData(input, setData, setFetching) {
  let res = {};
  if (input) {
    res = await productApi.findManyById(input);
  } else {
    res = await productApi.getMany();
    if (res.isSuccess) {
      res.products = res.products.rows;
    }
  }
  if (res.isSuccess) {
    let products = res.products || [];

    let _dataTable = products.map((p) => {
      return {
        value: p.id,
        label: p.id,
        // <div
        //   style={{
        //     display: "flex",
        //     alignItems: "center",
        //     position: "relative",
        //   }}
        // >
        //   <div>
        //     <img
        //       src={
        //         (p.images && p.images.length > 0 && p.images[0].uri) ||
        //         "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        //       }
        //       style={{
        //         width: "32px",
        //         height: "32px",
        //       }}
        //       alt="alt"
        //     />
        //   </div>
        //   <div
        //     style={{
        //       paddingLeft: "8px",
        //       paddingBottom: "12px",
        //     }}
        //   >
        //     {p.name}
        //     <div
        //       style={{
        //         fontSize: "12px",
        //       }}
        //     >
        //       {input ? (
        //         <HighlightedText text={p.id} highlightText={input} />
        //       ) : (
        //         p.id
        //       )}
        //     </div>
        //   </div>
        // </div>
      };
    });
    setData(_dataTable);
  }
}

export default ProductIdSelect;
