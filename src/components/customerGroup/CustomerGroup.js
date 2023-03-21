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
import "../../assets/styles/customerGroup.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import priceHeaderApi from "../../api/priceHeaderApi";
import DropSelectColum from "../product/DropSelectColum";
import { setPriceHeaders } from "../../store/slices/priceHeaderSlice";
import CustomerGroupCuModal from "./CustomerGroupCUModal";
import userApi from "./../../api/userApi";
import { setCustomers } from "../../store/slices/customerSlice";
import { setCustomerTypes } from "../../store/slices/customerTypeSlice";

const { Text } = Typography;

const CustomerGroup = ({}) => {
  const { customerTypes, refresh, count } = useSelector(
    (state) => state.customerType
  );
  console.log(customerTypes);
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
      title: "Mã nhóm",
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
      title: "Tên nhóm khách hàng",
      dataIndex: "name",
      width: 200,
      fixed: "left",
      fixedShow: true,
    },
  ]);

  useEffect(() => {
    getCustomerTypes(pageState.page, pageState.limit);
    return () => {};
  }, [pageState.page]);

  useEffect(() => {
    if (refresh) {
      getCustomerTypes(pageState.page, pageState.limit);
    }

    return () => {};
  }, [refresh]);

  async function getCustomerTypes(page, limit) {
    let res = await userApi.getAllCustomerType();
    if (res.isSuccess) {
      dispatch(setCustomerTypes(res.typeCustomers));
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
    <div className="customer_group">
      <div className="products">
        <div className="table__header">
          <div className="left">
            <Typography.Title
              level={4}
              style={{
                margin: 0,
              }}
            >
              Danh sách nhóm khách hàng{" "}
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
          dataSource={customerTypes}
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
        <CustomerGroupCuModal
          modalState={modalState}
          setModalState={setModalState}
        />
      </div>
    </div>
  );
};

export default CustomerGroup;
