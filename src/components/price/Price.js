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
import "../../assets/styles/priceLine.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { compareDMY, sqlToDDmmYYY } from "./../../utils/index";
import priceHeaderApi from "./../../api/priceHeaderApi";
import {
  setPriceHeaders,
  setRefreshPriceHeaders,
} from "../../store/slices/priceHeaderSlice";
import DropSelectColum from "./../product/DropSelectColum";
import PriceCUModal from "./PriceCUModal";

const { Text } = Typography;

const Price = ({}) => {
  const { priceHeaders, refresh, count } = useSelector(
    (state) => state.priceHeader
  );
  const { isAdmin } = useSelector((state) => state.user);

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
      type: isAdmin ? "update" : "view",
      visible: true,
      rowSelected: row,
    });
  }

  async function handleOnChangeState(is, headerId) {
    let result = false;
    if (is) {
      let isCheck = true;
      // kiểm tra trùng
      let res = await priceHeaderApi.getAllOnActive();
      let res2 = await priceHeaderApi.getOneById(headerId);
      let thisHeader = res2.header;
      let start1 = new Date(thisHeader.startDate);
      let end1 = new Date(thisHeader.endDate);

      let isExist = false;
      if (res.isSuccess) {
        let headers = res.headers || [];
        // loop through each header
        for (const header of headers) {
          let start2 = new Date(header.startDate);
          let end2 = new Date(header.endDate);

          let is1 =
            compareDMY(end2, start1) >= 0 && compareDMY(end2, end1) >= 0;
          let is2 =
            compareDMY(start1, start2) >= 0 && compareDMY(start1, end2) <= 0;
          let is3 =
            compareDMY(start1, start2) <= 0 && compareDMY(end2, end1) <= 0;
          console.log(is1, is2, is3);

          if (is1 || is2 || is3) {
            // loop through each line in a header
            let priceLines = header.Prices || [];

            for (const line of priceLines) {
              for (const _lineThisHeader of thisHeader.Prices || []) {
                if (
                  _lineThisHeader.ProductUnitTypeId == line.ProductUnitTypeId
                ) {
                  isExist = true;
                  isCheck = false;

                  message.error(
                    `Sản phẩm "${line.ProductUnitType.Product.name} với đơn vị ${line.ProductUnitType.UnitType.name}" đang được bán ở bảng ${header.title} `
                  );
                }
              }
            }
          }
        }
      }

      if (isCheck) {
        // to active header
        let res = await priceHeaderApi.updateOne({
          id: headerId,
          state: true,
        });

        if (res.isSuccess) {
          result = true;
          message.info("Áp dụng bảng giá thành công");
          dispatch(setRefreshPriceHeaders());
        }
      } else {
        result = false;
      }
    } else {
      let res = await priceHeaderApi.updateOne({
        id: headerId,
        state: false,
      });

      if (res.isSuccess) {
        result = true;
        message.info("Tạm dừng bảng giá thành công");
        dispatch(setRefreshPriceHeaders());
      } else {
        result = false;
      }
    }
    return result;
  }

  function disabledChangeState(rowData) {
    if (!isAdmin) return true;
    let start = new Date(rowData.startDate);
    let end = new Date(rowData.endDate);
    let now = new Date();

    // đã hết hạn
    if (compareDMY(end, now) < 0) {
      return true;
    }
    return false;
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
        {isAdmin && (
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
        )}
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
      <PriceCUModal
        modalState={modalState}
        setModalState={setModalState}
        handleOnChangeState={handleOnChangeState}
      />
    </div>
  );
};

export default Price;
