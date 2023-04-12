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
import { useEffect, useRef, useState } from "react";
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
import { compareDMY, convertToVND } from "../../../utils";

const SearchProductInput = (props) => {
  const dispatch = useDispatch();
  const { activeKey } = useSelector((state) => state.createBill.tabState);
  const list =
    useSelector((state) => state.createBill.listState[activeKey]) || [];

  const [quantityInput, setQuantityInput] = useState(1);
  const [priceSelected, setPriceSelected] = useState();
  const [maxQuantityAvailabe, setMaxQuantityAvailabe] = useState(1);

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

  useEffect(() => {
    if (priceSelected) {
      // tính số lượng tồn kho và số lượng đã thêm vào bill
      let totalOnBill = 0;
      let totalQuantity = priceSelected.ProductUnitType.Product.quantity;
      let convertionQuantity =
        priceSelected.ProductUnitType.UnitType.convertionQuantity;
      let productId = priceSelected.ProductUnitType.ProductId;

      // tính số lượng đã thêm vào bill trước đó
      list.map((priceLine) => {
        if (productId == priceLine.ProductUnitType.ProductId) {
          let convertionQuantityOnBill =
            priceLine.ProductUnitType.UnitType.convertionQuantity;
          totalOnBill += priceLine.quantity * convertionQuantityOnBill;
        }
      });
      let max = Math.floor((totalQuantity - totalOnBill) / convertionQuantity);

      setMaxQuantityAvailabe(max);
    }

    return () => {};
  }, [priceSelected, list]);

  function handleChangeQuantity(quantity) {
    setQuantityInput(quantity);
  }

  function handleAddProductToBill() {
    if (quantityInput < 1) {
      message.error("Số lượng phải > 0");
      return;
    }

    if (quantityInput > maxQuantityAvailabe) {
      message.error(
        "Bạn đã thêm sp vào đơn hàng trước đó, số lượng còn lại không đủ!"
      );
      return;
    }

    if (priceSelected) {
      dispatch(
        addOneProductToActiveTab({
          ...priceSelected,
          quantity: quantityInput,
        })
      );
    } else {
      message.warning("Vui lòng chọn sản phẩm trước!");
    }
    setInput("");
    setQuantityInput(1);
    setPriceSelected(null);
    searchInput.current.focus();
  }

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
        type="number"
        placeholder="Số lượng"
        value={quantityInput}
        onChange={(value) => {
          handleChangeQuantity(value);
        }}
        onKeyDown={({ nativeEvent }) => {
          if (nativeEvent.key == "Enter") {
            handleAddProductToBill();
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
  let productFounds = [];
  let res = {};
  res = await productApi.findManyById(input);
  console.log(res);
  if (res.isSuccess) {
    productFounds = res.products;
  }

  res = await priceHeaderApi.getAllOnActive();
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
      if (input) {
        for (const product of productFounds) {
          if (line.ProductUnitType.ProductId == product.id) {
            // tồn kho theo đơn vị đó <=0 thì ko bán
            let quanitty2 = calcQuantityByConvertion(
              product,
              line.ProductUnitType.UnitType
            );

            // tồn kho lớn hơn 0 thì bán
            if (quanitty2 > 0) {
              _listPrices.push(line);
            }
          }
        }
      } else {
        let quanitty2 = calcQuantityByConvertion(
          line.ProductUnitType.Product,
          line.ProductUnitType.UnitType
        );

        // tồn kho lớn hơn 0 thì bán
        if (quanitty2 > 0) {
          _listPrices.push(line);
        }
      }
    });
  });

  function calcQuantityByConvertion(product, unitype) {
    let convertionQuantity = unitype.convertionQuantity;
    let quantity = product.quantity;
    let quantity2 =
      (quantity - (quantity % convertionQuantity)) / convertionQuantity;
    return quantity2;
  }

  let data = _listPrices.map((line, index) => {
    let product = line.ProductUnitType.Product;
    let unitype = line.ProductUnitType.UnitType;
    let putId = line.ProductUnitTypeId;

    let imageUri = "";
    let images = product.images;
    if (images && images.length > 0) {
      imageUri = images[0].uri;
    }

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
          <div
            style={{
              width: "32px",
              height: "32px",
            }}
          >
            {imageUri && (
              <img
                src={imageUri}
                style={{
                  width: "32px",
                  height: "32px",
                }}
                alt="alt"
              />
            )}
          </div>
          <div
            style={{
              paddingLeft: "8px",
              paddingBottom: "12px",
            }}
          >
            {product.name}
            <div
              style={{
                fontSize: "12px",
              }}
            >
              <HighlightedText text={product.id} highlightText={input} />
            </div>
            <div>Tồn kho: {calcQuantityByConvertion(product, unitype)}</div>
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
              {convertToVND(line.price)}
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
