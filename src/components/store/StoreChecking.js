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
import { sqlToDDmmYYY, sqlToHHmmDDmmYYYY } from "../../utils/index";
import priceHeaderApi from "../../api/priceHeaderApi";
import DropSelectColum from "../product/DropSelectColum";
import PriceCUModal from "../price/PriceCUModal";
import StoreTransationDetailModal from "../StoreTransationDetailModal";
import { setPriceHeaders } from "../../store/slices/priceHeaderSlice";
import StoreCUModal from "./StoreCUModal";
import storeApi from "../../api/storeApi";
import { setStoreTickets } from "../../store/slices/storeTicketSlice";
import StoreCheckingModal from "./StoreCheckingModal";
import { setOpen } from "../../store/slices/modalSlice";

const { Text } = Typography;

const StoreChecking = ({}) => {
  const { storeTickets, refresh, count } = useSelector(
    (state) => state.storeTicket
  );
  const dispatch = useDispatch();

  const [pageState, setPageState] = useState({
    page: 1,
    limit: 10,
  });

  const [allColumns, setAllColumns] = useState([
    {
      title: "Mã chứng từ",
      dataIndex: "id",
      width: 160,
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
      title: "Mã nhân viên",
      dataIndex: "EmployeeId",
      render: (_, rowData) => {
        if (rowData) {
          return <div>{rowData.EmployeeId}</div>;
        }
      },
    },
    {
      title: "Tên nhân viên",
      render: (_, rowData) => {
        if (rowData) {
          return rowData.Employee.name;
        }
      },
    },

    {
      width: 200,
      title: "Thời gian kiểm",
      dataIndex: "createAt",
      render: (createAt) => {
        return sqlToHHmmDDmmYYYY(createAt);
      },
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

  function onRowIdClick(row) {
    dispatch(
      setOpen({
        name: "StoreCheckingModal",
        modalState: {
          visible: true,
          type: "view",
          idSelected: row.id,
        },
      })
    );
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
              dispatch(
                setOpen({
                  name: "StoreCheckingModal",
                  modalState: {
                    type: "create",
                    visible: true,
                  },
                })
              );
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
    </div>
  );
};

export default StoreChecking;
