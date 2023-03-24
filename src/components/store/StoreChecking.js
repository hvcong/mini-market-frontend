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
import { sqlToDDmmYYY } from "../../utils/index";
import priceHeaderApi from "../../api/priceHeaderApi";
import DropSelectColum from "../product/DropSelectColum";
import PriceCUModal from "../price/PriceCUModal";
import StoreTransationDetailModal from "../StoreTransationDetailModal";
import { setPriceHeaders } from "../../store/slices/priceHeaderSlice";
import StoreCUModal from "./StoreCUModal";
import storeApi from "../../api/storeApi";
import { setStoreTickets } from "../../store/slices/storeTicketSlice";
import StoreCheckingModal from "./StoreCheckingModal";

const { Text } = Typography;

const StoreChecking = ({}) => {
  const { storeTickets, refresh, count } = useSelector(
    (state) => state.storeTicket
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

  const [
    isShowStoreTransactionDetailModal,
    setIsShowStoreTransactionDetailModal,
  ] = useState(false);
  const [idTransactionSelected, setIdTransactionSelected] = useState(null);
  const [allColumns, setAllColumns] = useState([
    {
      title: "Mã chứng từ",
      dataIndex: "id",
      width: 100,
      fixed: "left",
      fixedShow: true,
      render: (_, row) => (
        <Typography.Link
          onClick={() => {
            onRowIdClick(row);
          }}
        >
          {row.id}
        </Typography.Link>
      ),
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "ProductId",
    },
    {
      title: "Mã nhân viên",
      dataIndex: "EmployeeId",
      render: (_, rowData) => {
        if (rowData) {
          return <Typography.Link>{rowData.EmployeeId}</Typography.Link>;
        }
      },
    },
    {
      title: "Tên nhân viên",
      hidden: true,
      render: (_, rowData) => {
        if (rowData) {
          return rowData.Employee.name;
        }
      },
    },
    {
      title: "Số lượng báo cáo",
      dataIndex: "reportQty",
    },
    {
      title: "Số lượng thực tế",
      dataIndex: "realQty",
    },
    {
      title: "Số lượng biến động",
      dataIndex: "availableBudget",
      render: (_, rowData) => {
        if (rowData) {
          return rowData.reportQty - rowData.realQty;
        }
      },
    },
    {
      width: 200,
      title: "Thời gian kiểm",
      dataIndex: "createAt",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
    },
  ]);

  useEffect(() => {
    getTicketStores(pageState.page, pageState.limit);
    return () => {};
  }, [pageState.page]);

  useEffect(() => {
    if (refresh) {
      getTicketStores(pageState.page, pageState.limit);
    }

    return () => {};
  }, [refresh]);

  async function getTicketStores(page, limit) {
    let res = await storeApi.getLimitTiket(page, limit);
    if (res.isSuccess) {
      dispatch(setStoreTickets(res.tickets));
    }
  }

  // pagination handle
  function onChangePageNumber(pageNumber, pageSize) {
    setPageState({
      page: pageNumber,
      limit: pageSize,
    });
  }

  // open storetransactionDetail modal with id
  function openStoreTrDetailModal(id) {
    setIdTransactionSelected(id);
    setIsShowStoreTransactionDetailModal(true);
  }

  function onRowIdClick(row) {
    setModalState({
      type: "update",
      visible: true,
      rowSelected: row,
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
            Danh sách phiếu kiểm kê{" "}
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
        dataSource={storeTickets}
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
      <StoreCheckingModal
        modalState={modalState}
        setModalState={setModalState}
      />
    </div>
  );
};

export default StoreChecking;
