import {
  Button,
  Col,
  Dropdown,
  message,
  Modal,
  Pagination,
  Row,
  Space,
  Spin,
  Switch,
  Table,
  Tooltip,
  Typography,
} from "antd";
import {
  MoreOutlined,
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  HolderOutlined,
  StopOutlined,
  DownOutlined,
} from "@ant-design/icons";
import "../../assets/styles/customer.scss";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import priceHeaderApi from "./../../api/priceHeaderApi";
import { setPriceHeaders } from "../../store/slices/priceHeaderSlice";
import DropSelectColum from "./../product/DropSelectColum";
import CustomerCUModal from "./CustomerCUModal";
import userApi from "./../../api/userApi";
import { setCustomers } from "../../store/slices/customerSlice";

const { Text } = Typography;

const Customer = ({}) => {
  const { customers, refresh, count } = useSelector(
    (state) => state.priceHeader
  );
  const dispatch = useDispatch();

  const [modalState, setModalState] = useState({
    visible: false,
    type: "",
    rowSelected: null,
  });

  const [pageState, setPageState] = useState({
    page: 1,
    limit: 10,
  });

  const [allColumns, setAllColumns] = useState([
    {
      title: "Mã khách hàng",
      dataIndex: "id",
      width: 200,
      fixed: "left",
      fixedShow: true,
      render: (_, rowData) => {
        return (
          <Typography.Link
            onClick={() => {
              setModalState({
                type: "update",
                visible: true,
                rowSelected: rowData,
              });
            }}
          >
            {rowData.id}
          </Typography.Link>
        );
      },
    },
    {
      title: "Tên",
      dataIndex: "name",
      width: 200,
      fixed: "left",
      fixedShow: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phonenumber",
    },

    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Nhóm khách hàng",
      dataIndex: "groupId",
    },
  ]);

  useEffect(() => {
    getCustomers(pageState.page, pageState.limit);
    return () => {};
  }, [pageState.page]);

  useEffect(() => {
    if (refresh) {
      getCustomers(pageState.page, pageState.limit);
    }

    return () => {};
  }, [refresh]);

  async function getCustomers(page, limit) {
    let res = await userApi.getLimitCustomers(page, limit);
    if (res.isSuccess) {
      dispatch(setCustomers(res.customers));
    }
  }

  // pagination handle
  function onChangePageNumber(pageNumber, pageSize) {
    setPageState({
      page: pageNumber,
      limit: pageSize,
    });
  }

  return (
    <div className="products">
      <div className="table__header">
        <div className="left">
          <Typography.Title
            level={4}
            style={{
              margin: 0,
            }}
          >
            Danh sách khách hàng{" "}
          </Typography.Title>
        </div>
        <div className="btn__item">
          <Button
            size="small"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setModalState({
                type: "create",
                visible: true,
              });
            }}
          >
            Thêm mới
          </Button>
        </div>
        <div className="btn__item">
          <DropSelectColum
            allColumns={allColumns}
            setAllColumns={setAllColumns}
          />
        </div>
      </div>

      {/* table */}

      <Table
        columns={allColumns.filter((col) => !col.hidden)}
        dataSource={customers}
        pagination={false}
        size="small"
        scroll={{
          x: allColumns.filter((item) => !item.hidden).length * 150,
          y: window.innerHeight * 0.66,
        }}
        className="table"
      />
      <div className="pagination__container">
        <Pagination
          onChange={onChangePageNumber}
          total={count}
          pageSize={10}
          current={pageState.page}
          hideOnSinglePage
        />
      </div>
      <CustomerCUModal modalState={modalState} setModalState={setModalState} />
    </div>
  );
};

export default Customer;
