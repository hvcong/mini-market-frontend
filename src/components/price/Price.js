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
import "../../assets/styles/priceLine.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { compareDMY, sqlToDDmmYYY } from "./../../utils/index";
import priceHeaderApi from "./../../api/priceHeaderApi";
import { setPriceHeaders } from "../../store/slices/priceHeaderSlice";
import DropSelectColum from "./../product/DropSelectColum";
import PriceCUModal from "./PriceCUModal";

const { Text } = Typography;

const Price = ({}) => {
  const { priceHeaders, refresh, count } = useSelector(
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
      title: "Id",
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
      title: "Tên",
      dataIndex: "title",
      width: 200,
      fixed: "left",
      fixedShow: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: 200,
      hidden: true,
      render: () => {
        return "thông tin chi tiết về bảng giá";
      },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      render: (_, header) => <>{sqlToDDmmYYY(header.startDate)}</>,
    },

    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      render: (_, header) => <>{sqlToDDmmYYY(header.endDate)}</>,
    },
    {
      title: "Trạng thái",
      dataIndex: "state",
      render: (_, header) => {
        let start = new Date(header.startDate);
        let end = new Date(header.endDate);
        let now = new Date();

        if (
          header.state &&
          compareDMY(start, now) <= 0 &&
          compareDMY(end, now) > 0
        ) {
          return <div style={{ color: "green" }}>Đang sử dụng</div>;
        } else {
          return <div style={{ color: "red" }}>Đã ngưng</div>;
        }
      },
    },
  ]);

  useEffect(() => {
    getPriceHeaders(pageState.page, pageState.limit);
    return () => {};
  }, [pageState.page]);

  useEffect(() => {
    if (refresh) {
      getPriceHeaders(pageState.page, pageState.limit);
    }

    return () => {};
  }, [refresh]);

  async function getPriceHeaders(page, limit) {
    let res = await priceHeaderApi.getMany(page, limit);

    if (res.isSuccess) {
      dispatch(setPriceHeaders(res.headers));
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
            Danh sách bảng giá{" "}
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

      <Table
        columns={allColumns.filter((col) => !col.hidden)}
        dataSource={priceHeaders}
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
      <PriceCUModal modalState={modalState} setModalState={setModalState} />
    </div>
  );
};

export default Price;
