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

const SearchProductInput = (props) => {
  const dispatch = useDispatch();
  const { activeKey } = useSelector((state) => state.createBill.tabState);
  const list =
    useSelector((state) => state.createBill.listState[activeKey]) || [];
  const [quantityInput, setQuantityInput] = useState(2);
  const [productLine, setProductLine] = useState({});

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
    let [productId, putId] = value.split("///");
    let res = await priceLineApi.getOneBy_PUT_id(putId);
    if (res.isSuccess) {
      setInput(res.price.ProductUnitType.Product.name);
      // setQuantityInput(1);
      quantityRef.current.select();
      quantityRef.current.focus();
    }
    setProductLine(res.price);
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
            dispatch(
              addOneProductToActiveTab({
                ...productLine,
                quantity: quantityInput,
              })
            );
            setInput("");
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
  let products = [];
  let typeFind = "name";
  let res = await productApi.findManyByName(input);
  console.log(res);
  if (res.isSuccess) {
    products = res.products || [];
  }

  let _listP = [];

  products.map((product) => {
    if (product.ProductUnitTypes) {
      product.ProductUnitTypes.map((put) => {
        let isExist = false;
        list.map((pline) => {
          if (pline.ProductUnitType.id == put.id) {
            isExist = true;
          }
        });

        if (!isExist) {
          _listP.push({
            ...product,
            put: put,
          });
        }
      });
    }
  });

  let data = _listP.map((p, index) => {
    return {
      value: p.id + "///" + p.put.id,
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
            <HighlightedText text={p.name} highlightText={input} />
            <div
              style={{
                fontSize: "12px",
              }}
            >
              {p.id}
            </div>
            <div> Tồn kho: {p.quantity} || KH đặt: 4</div>
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <Typography.Title level={5} type="success">
              <Tag color="gold">{p.put.UnitType.name}</Tag>
              {p.put.Prices[0].price}
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
