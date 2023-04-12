import {
  Button,
  Divider,
  Empty,
  Input,
  Select,
  Space,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import { useEffect, useRef, useState } from "react";
import userApi from "../../../api/userApi";
import { useDispatch, useSelector } from "react-redux";
import {
  addTab,
  onChangeCustomerPhone,
  setIsShowNewCustomer,
  setNewPhoneInput,
} from "../../../store/slices/createBillSlice";
import HighlightedText from "../../HighlightedText";
import {
  InfoCircleOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { isVietnamesePhoneNumberValid, uid } from "../../../utils";

const CustomerSelect = (props) => {
  const { activeKey } = useSelector((state) => state.createBill.tabState);
  const { tabItems } = useSelector((state) => state.createBill.tabState) || [];
  const [errMess, setErrMess] = useState("");
  let customerPhone = "0";
  tabItems.map((item) => {
    if (item.key == activeKey) {
      customerPhone = item.customerPhone || "0";
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
    if (input) {
      let newInput = input.trim();
      if (newInput) {
        if (newInput.length > 0) {
          let result = isVietnamesePhoneNumberValid(newInput);
          if (!result) {
            setErrMess("Số điện thoại chưa hợp lệ");
          } else {
            setErrMess("");
          }
        }
      }
    }

    setInput(input);
    // fetching data here
    fetchData(input, setData, setFetching);
  };
  const handleChange = async (value) => {
    setErrMess("");
    setInput(value);
    dispatch(onChangeCustomerPhone(value));
  };

  async function addNewCustomer(phone) {
    setInput(phone);
    let res = await userApi.addOneCustomer({
      phonenumber: phone,
    });
    if (res.isSuccess) {
      handleChange(phone);
    }
  }

  return (
    <div
      className="customer_select"
      style={{
        display: "flex",
      }}
    >
      <Select
        {...props}
        size="small"
        showSearch
        placeholder="Khách hàng"
        optionFilterProp="children"
        value={customerPhone}
        defaultActiveFirstOption
        showArrow={false}
        onClick={() => {
          handleSearch("");
        }}
        onBlur={() => {
          setErrMess("");
        }}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        dropdownRender={(menu) => (
          <>
            {menu}
            {data.length == 0 && !errMess && (
              <>
                <Divider
                  style={{
                    margin: "8px 0",
                  }}
                />

                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    addNewCustomer(input);
                  }}
                  style={{
                    width: "100%",
                  }}
                >
                  Thêm mới
                </Button>
              </>
            )}
          </>
        )}
        notFoundContent={fetching ? <Spin size="small" /> : <></>}
        options={(data || []).map((item) => ({
          value: item.value,
          label: item.label,
        }))}
        status={errMess && "error"}
      />
      {errMess && (
        <Tooltip
          placement="topRight"
          title={"Số điện thoại không hợp lệ!"}
          color={"red"}
        >
          <WarningOutlined
            style={{
              color: "red",
              marginLeft: 8,
              cursor: "pointer",
            }}
          />
        </Tooltip>
      )}
    </div>
  );
};

async function fetchData(input, setData, setFetching) {
  setFetching(true);
  let data = [];

  let res = await userApi.getAllCustomerLikePhone(input || "0");
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
