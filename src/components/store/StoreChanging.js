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
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import priceHeaderApi from "./../../api/priceHeaderApi";
import { setPriceHeaders } from "../../store/slices/priceHeaderSlice";
import DropSelectColum from "./../product/DropSelectColum";
import StoreCUModal from "./StoreCUModal";
import storeApi from "./../../api/storeApi";
import { setStoreTrans } from "../../store/slices/storeTranSlice";
import { antdToDmy, sqlToDDmmYYY } from "../../utils";

const { Text } = Typography;

const StoreChanging = ({}) => {
  const { storeTrans, refresh, count } = useSelector(
    (state) => state.storeTran
  );
  console.log(storeTrans);
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
      title: "Mã",
      dataIndex: "id",
      width: 100,
      fixed: "left",
      fixedShow: true,
      render: (_, row) => <Typography.Link>{row.id}</Typography.Link>,
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "productId",
    },
    {
      title: "Phương thức",
      dataIndex: "type",
    },
    {
      title: "Số lượng biến động",
      dataIndex: "quantity",
    },
    {
      width: 200,
      title: "Thời gian",
      dataIndex: "createAt",
      render: (_, rowData) => {
        return sqlToDDmmYYY(rowData.createAt);
      },
    },

    {
      title: "Mã nhân viên",
      dataIndex: "EmployeeId",
    },
  ]);

  useEffect(() => {
    getStoreTransactions(pageState.page, pageState.limit);
    return () => {};
  }, [pageState.page]);

  useEffect(() => {
    if (refresh) {
      getStoreTransactions(pageState.page, pageState.limit);
    }

    return () => {};
  }, [refresh]);

  async function getStoreTransactions(page, limit) {
    let res = await storeApi.getLimitStoreTransactions(page, limit);
    if (res.isSuccess) {
      dispatch(setStoreTrans(res.transactions));
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
            Danh sách biến động kho{" "}
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
            Nhập kho
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
        dataSource={storeTrans}
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
      <StoreCUModal modalState={modalState} setModalState={setModalState} />
    </div>
  );
};

export default StoreChanging;
