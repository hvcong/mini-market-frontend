import {
  Button,
  Col,
  Dropdown,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
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
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import "../../assets/styles/bill.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { sqlToDDmmYYY } from "./../../utils/index";
import DropSelectColum from "./../product/DropSelectColum";
import promotionApi from "./../../api/promotionApi";
import { setPromotionHeaders } from "../../store/slices/promotionHeaderSlice";
import billApi from "./../../api/billApi";
import { setBills } from "../../store/slices/billSlice";
import { setOpen } from "../../store/slices/modalSlice";

const { Text } = Typography;

const Order = ({}) => {
  let hideLoading = null;
  const { bills, refresh, count } = useSelector((state) => state.bill);
  const dispatch = useDispatch();

  const [pageState, setPageState] = useState({
    page: 1,
    limit: 10,
  });

  const [allColumns, setAllColumns] = useState([]);
  useEffect(() => {
    let _allCol = [
      {
        title: "Mã đơn hàng",
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
        title: "Ngày tạo",
        dataIndex: "orderDate",
      },

      {
        title: "Mã khách hàng",
        dataIndex: "CustomerId",
        render: (CustomerId, rowData) => {
          return <Typography.Link>{CustomerId}</Typography.Link>;
        },
      },
      {
        title: "Xử lí",
        width: 120,
        fixed: "right",
        render: () => {
          return (
            <Popover
              placement="leftTop"
              content={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Button
                    size="small"
                    style={{
                      marginBottom: 12,
                    }}
                    type="primary"
                  >
                    Thanh toán
                  </Button>
                  <Button size="small" danger>
                    Hủy đơn hàng
                  </Button>
                </div>
              }
            >
              <Button size="small" icon={<MenuUnfoldOutlined />}></Button>
            </Popover>
          );
        },
      },
    ];

    setAllColumns(_allCol);
    return () => {};
  }, []);

  useEffect(() => {
    getBills(pageState.page, pageState.limit);
    return () => {};
  }, [pageState.page]);

  useEffect(() => {
    if (refresh) {
      console.log("refresh");
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
    let res = await billApi.getLimitBill(page, limit);
    if (res.isSuccess) {
      dispatch(setBills(res.bills));
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
    dispatch(
      setOpen({
        name: "BillCUModal",
        modalState: {
          visible: true,
          type: "view-order",
          idSelected: row.id,
        },
      })
    );
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
            Danh sách đơn đặt hàng{" "}
          </Typography.Title>
        </div>
        <div className="btn__item">
          <Button
            size="small"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              // setModalState({
              //   type: "create",
              //   visible: true,
              // });
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
        dataSource={bills}
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

export default Order;
