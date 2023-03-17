import { SearchOutlined } from "@ant-design/icons";
import { Empty, message, Select, Spin, Tag } from "antd";
import { useState } from "react";
import productApi from "./../../api/productApi";
import HighlightedText from "../HighlightedText";
import { useDispatch } from "react-redux";
import { addPriceLine, setPriceLines } from "../../store/slices/priceLineSlice";

const SearchProductInput = (props) => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [input, setInput] = useState();
  const [fetching, setFetching] = useState(false);
  const handleSearch = (input) => {
    // fetching data here
    fetchData(input, setData, setFetching);
  };
  const handleChange = async (value) => {
    let res = await productApi.findOneById(value);
    if (res.isSuccess) {
      message.info("handle more");
      dispatch(
        addPriceLine({
          id: "cong-create",
          startDate: "",
          endDate: "",
          price: 10000,
          state: true,
          product: res.product,
          isCanDelete: true,
          ProductUnitTypeId: "eeee",
        })
      );
    }
    setInput("");
  };

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
  setFetching(true);
  let products = [];
  let typeFind = "name";
  let res = await productApi.findManyByName(input);
  if (res.isSuccess) {
    products = res.products || [];
  }

  if (products.length == 0) {
    typeFind = "id";
    res = await productApi.findManyByName(input);
    if (res.isSuccess) {
      products = res.products || [];
    }
  }

  let data = products.map((p) => {
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
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
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
            {typeFind == "name" ? (
              <>
                <HighlightedText text={p.name} highlightText={input} />
                <div
                  style={{
                    fontSize: "12px",
                  }}
                >
                  {p.id}
                </div>
                <div>Tồn kho: 100 || KH đặt: 4</div>
              </>
            ) : (
              <>
                <div>{p.name}</div>
                <HighlightedText text={p.id} highlightText={input} />
                <div>Tồn kho: 100 || KH đặt: 4</div>
              </>
            )}
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <Tag color="gold">Lon</Tag>
          </div>
        </div>
      ),
    };
  });
  setData(data);
  setFetching(false);
}

export default SearchProductInput;
