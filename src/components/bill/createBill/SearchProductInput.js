import { SearchOutlined } from "@ant-design/icons";
import {
  Empty,
  InputNumber,
  message,
  Select,
  Spin,
  Tag,
  Typography,
} from "antd";
import { useRef, useState } from "react";
import productApi from "../../../api/productApi";
import HighlightedText from "../../HighlightedText";
import { useDispatch, useSelector } from "react-redux";
import {
  addPriceLine,
  setPriceLines,
} from "../../../store/slices/priceLineSlice";
import priceLineApi from "../../../api/priceLineApi";
import { addOneProductToActiveTab } from "../../../store/slices/createBillSlice";
import priceHeaderApi from "../../../api/priceHeaderApi";
import { compareDMY } from "../../../utils";

const SearchProductInput = (props) => {
  const dispatch = useDispatch();
  const { activeKey } = useSelector((state) => state.createBill.tabState);
  const list =
    useSelector((state) => state.createBill.listState[activeKey]) || [];
  const [quantityInput, setQuantityInput] = useState(2);
  const [priceSelected, setPriceSelected] = useState();

  const quantityRef = useRef();
  const searchInput = useRef();

  const [data, setData] = useState([]);
  const [input, setInput] = useState();
  const [fetching, setFetching] = useState(false);
  const handleSearch = (input) => {
    // fetching data here
    fetchData(input, setData, setFetching, list);
  };
  const handleChange = async (value) => {
    searchInput.current.focus();
    if (value) {
      let res = await priceLineApi.getOneById(value);
      if (res.isSuccess) {
        let price = res.price;
        let str = `${price.ProductUnitType.Product.name} (${price.ProductUnitType.UnitType.name})`;
        setInput(str);
        setQuantityInput(1);
        quantityRef.current.select();
        quantityRef.current.focus();
        setPriceSelected(price);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyItems: "center",
      }}
    >
      <Select
        ref={searchInput}
        showSearch
        value={input}
        placeholder={"Thêm sản phẩm vào hóa đơn"}
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
      <InputNumber
        placeholder="Số lượng"
        value={quantityInput}
        onChange={(value) => {
          setQuantityInput(value);
        }}
        onKeyDown={({ nativeEvent }) => {
          if (nativeEvent.key == "Enter") {
            if (priceSelected) {
              dispatch(
                addOneProductToActiveTab({
                  ...priceSelected,
                  quantity: quantityInput,
                })
              );
            }
            setInput("");
            setPriceSelected(null);
            searchInput.current.focus();
          }
        }}
        ref={quantityRef}
        style={{
          width: "88px",
        }}
      />
    </div>
  );
};

async function fetchData(input, setData, setFetching, list) {
  setFetching(true);
  let headers = []; // header on using
  let res = await priceHeaderApi.getAllOnActive();
  if (res.isSuccess) {
    for (const header of res.headers || []) {
      let start = new Date(header.startDate);
      let end = new Date(header.endDate);
      let now = new Date();
      let state = header.state;

      if (compareDMY(start, now) <= 0 && compareDMY(end, now) >= 0 && state) {
        headers.push(header);
      }
    }
  }
  let _listPrices = [];

  headers.map((header) => {
    header.Prices.map((line) => {
      _listPrices.push(line);
    });
  });

  let data = _listPrices.map((line, index) => {
    let product = line.ProductUnitType.Product;
    let unitype = line.ProductUnitType.UnitType;
    let putId = line.ProductUnitTypeId;

    return {
      value: line.id,
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
            <HighlightedText text={product.name} highlightText={input} />
            <div
              style={{
                fontSize: "12px",
              }}
            >
              <HighlightedText text={product.id} highlightText={input} />
            </div>
            <div>Tồn kho: {product.quantity / unitype.convertionQuantity}</div>
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <Typography.Title level={5} type="success">
              <Tag color="gold">{unitype.name}</Tag>
              {line.price}
            </Typography.Title>
          </div>
        </div>
      ),
    };
  });
  setData(data);
  setFetching(false);
}

export default SearchProductInput;
