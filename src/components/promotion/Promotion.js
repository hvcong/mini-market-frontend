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
  Tag,
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
import "../../assets/styles/promotion.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { compareDMY, sqlToDDmmYYY } from "./../../utils/index";
import priceHeaderApi from "./../../api/priceHeaderApi";
import { setPriceHeaders } from "../../store/slices/priceHeaderSlice";
import DropSelectColum from "./../product/DropSelectColum";
import PriceCUModal from "./../price/PriceCUModal";
import PromotionHeaderModal from "./PromotionHeaderModal";
import promotionApi from "./../../api/promotionApi";
import {
  setPromotionHeaders,
  setRefreshPromotionHeaders,
} from "../../store/slices/promotionHeaderSlice";

const { Text } = Typography;

const Promotion = ({}) => {
  let hideLoading = null;
  const { promotionHeaders, refresh, count } = useSelector(
    (state) => state.promotionHeader
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
      title: "Mã",
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
      title: "Mô tả",
      dataIndex: "discription",
      hidden: true,
    },

    {
      title: "Tình trạng sử dụng",
      dataIndex: "state",
      render: (_, header) => {
        let start = new Date(header.startDate);
        let end = new Date(header.endDate);
        let now = new Date();

        if (compareDMY(start, now) <= 0 && compareDMY(end, now) >= 0) {
          if (header.state) {
            return (
              <Tag
                color="green"
                style={{
                  fontSize: 11,
                }}
              >
                Đang sử dụng
              </Tag>
            );
          } else {
            return (
              <Tag
                color="pink"
                style={{
                  fontSize: 11,
                }}
              >
                Tạm ngưng
              </Tag>
            );
          }
        }
        if (compareDMY(start, now) > 0) {
          return (
            <Tag
              style={{
                fontSize: 11,
              }}
              color="gold"
            >
              Sắp tới
            </Tag>
          );
        }

        if (compareDMY(end, now) < 0) {
          return (
            <Tag
              style={{
                fontSize: 11,
              }}
              color="red"
            >
              Đã hết hạn
            </Tag>
          );
        }
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "state",
      render: (state, rowData) => {
        return (
          <Switch
            checkedChildren="On"
            unCheckedChildren="Off"
            checked={state}
            disabled={disabledChangeState(rowData)}
            onChange={(is) => {
              handleOnChangeState(is, rowData.id);
            }}
          />
        );
      },
    },
  ]);

  useEffect(() => {
    getPromotionHeaders(pageState.page, pageState.limit);
    return () => {};
  }, [pageState.page]);

  useEffect(() => {
    if (refresh) {
      getPromotionHeaders(pageState.page, pageState.limit);
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

  async function getPromotionHeaders(page, limit) {
    hideLoading = message.loading("Tải dữ liệu chương trình khuyến mãi...", 0);
    let res = await promotionApi.getLimitHeader(page, limit);
    if (res.isSuccess) {
      dispatch(setPromotionHeaders(res.promotions));
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
      type: "update",
      visible: true,
      rowSelected: row,
    });
  }

  function disabledChangeState(rowData) {
    let start = new Date(rowData.startDate);
    let end = new Date(rowData.endDate);
    let now = new Date();

    // đã hết hạn
    if (compareDMY(end, now) < 0) {
      return true;
    }
    return false;
  }

  async function handleOnChangeState(is, headerId) {
    let res = await promotionApi.updateOneHeader(headerId, {
      state: is,
    });

    if (res.isSuccess) {
      if (is) {
        message.info("Đã đưa chương trình vào hoạt động");
      } else {
        message.info("Đã ngưng hoạt động của chương trình");
      }
      dispatch(setRefreshPromotionHeaders());
    }
  }

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
            Danh sách chương trình khuyến mãi{" "}
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
        dataSource={promotionHeaders}
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
      <PromotionHeaderModal
        modalState={modalState}
        setModalState={setModalState}
        handleOnChangeState={handleOnChangeState}
      />
    </div>
  );
};

export default Promotion;
