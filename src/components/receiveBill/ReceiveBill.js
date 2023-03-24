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
  RedoOutlined,
} from "@ant-design/icons";
import "../../assets/styles/bill.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { sqlToDDmmYYY } from "./../../utils/index";
import DropSelectColum from "./../product/DropSelectColum";
import promotionApi from "./../../api/promotionApi";
import billApi from "./../../api/billApi";
import { setBills } from "../../store/slices/billSlice";
import BillCUModal from "../bill/BillCUModal";
import { setReceiveBills } from "../../store/slices/receiveBillSlice";

const { Text } = Typography;

const ReceiveBill = ({}) => {
  let hideLoading = null;
  const { receiveBills, refresh, count } = useSelector(
    (state) => state.receiveBill
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
      title: "Mã hóa đơn",
      dataIndex: "",
      width: 160,
      fixed: "left",
      fixedShow: true,
      render: (_, row) => (
        <Typography.Link
          onClick={() => {
            onRowIdClick(row);
          }}
        >
          {row.BillId}
        </Typography.Link>
      ),
    },
    {
      title: "Ngày trả",
      width: 200,
      dataIndex: "createAt",
      render: (createAt) => {
        return sqlToDDmmYYY(createAt);
      },
    },

    {
      title: "Ghi chú",
      dataIndex: "note",
    },
  ]);

  useEffect(() => {
    getBills(pageState.page, pageState.limit);
    return () => {};
  }, [pageState.page]);

  useEffect(() => {
    if (refresh) {
      getBills(pageState.page, pageState.limit);
    }

    return () => {};
  }, [refresh]);

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, []);

  async function getBills(page, limit) {
    hideLoading = message.loading("Tải dữ liệu hóa đơn...", 0);
    let res = await billApi.getLimitReceives(page, limit);
    if (res.isSuccess) {
      dispatch(setReceiveBills(res.retrieves));
    }
    hideLoading();
  }

  // pagination handle
  function onChangePageNumber(pageNumber, pageSize) {
    setPageState({
      page: pageNumber,
      limit: pageSize,
    });
  }

  function onRowIdClick(row) {
    setModalState({
      type: "view-receive",
      visible: true,
      rowSelected: row,
    });
  }

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, []);

  return (
    <div className="products promotion">
      <div className="table__header">
        <div className="left">
          <Typography.Title
            level={4}
            style={{
              margin: 0,
            }}
          >
            Danh sách hóa đơn đã trả hàng{" "}
          </Typography.Title>
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
        dataSource={receiveBills}
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
      <BillCUModal modalState={modalState} setModalState={setModalState} />
    </div>
  );
};

export default ReceiveBill;
