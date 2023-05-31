import {
  Button,
  Col,
  Dropdown,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
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
import {
  convertToVND,
  sqlToDDmmYYY,
  sqlToHHmmDDmmYYYY,
} from "./../../utils/index";
import DropSelectColum from "./../product/DropSelectColum";
import promotionApi from "./../../api/promotionApi";
import { setPromotionHeaders } from "../../store/slices/promotionHeaderSlice";
import BillCUModal from "./BillCUModal";
import billApi from "./../../api/billApi";
import { setBills, setRefreshBills } from "../../store/slices/billSlice";
import ReceiveButton from "./ReceiveButton";
import { setOpen } from "../../store/slices/modalSlice";
import HighlightedText from "../HighlightedText";
import { useGlobalContext } from "../../store/GlobalContext";

const { Text } = Typography;

const Bill = ({}) => {
  const { bills, refresh, count } = useSelector((state) => state.bill);

  const [receiveOpenId, setReceiveOpenId] = useState("billId");
  let data = bills;

  const [dataAfterFilted, setDataAfterFilted] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [dataTable, setDataTable] = useState([{ isFirstRow: true }]);
  const [allColumns, setAllColumns] = useState([]);

  const [filterState, setFilterState] = useState({
    id: "",
    employeeId: "",
    employeeName: "",
    customerId: "",
  });

  const [pageState, setPageState] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  function clearFilter() {
    setFilterState({});
  }

  useEffect(() => {
    setAllColumns([
      {
        title: "STT",
        width: 44,
        fixed: "left",

        dataIndex: "index",
      },

      {
        title: "Mã hóa đơn",
        dataIndex: "id",
        width: 160,
        fixed: "left",
        fixedShow: true,
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.id}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    id: target.value,
                  });
                }}
              />
            );
          }

          return (
            <Typography.Link
              onClick={() => {
                onRowIdClick(rowData);
              }}
            >
              <HighlightedText text={_} highlightText={filterState.id} />
            </Typography.Link>
          );
        },
      },

      {
        title: "Ngày tạo",
        dataIndex: "updatedAt",
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            if (_) {
              return sqlToHHmmDDmmYYYY(_);
            } else {
              return sqlToHHmmDDmmYYYY(rowData.orderDate);
            }
          }
        },
      },

      {
        title: "Tổng tiền",
        dataIndex: "cost",
        align: "right",
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return convertToVND(_);
          }
        },
      },
      {
        title: "Mã nhân viên",
        dataIndex: "EmployeeId",
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.employeeId}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    employeeId: target.value,
                  });
                }}
              />
            );
          }

          return (
            <HighlightedText text={_} highlightText={filterState.employeeId} />
          );
        },
      },
      {
        title: "Tên nhân viên",
        dataIndex: "Employee",
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.employeeName}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    employeeName: target.value,
                  });
                }}
              />
            );
          }

          return (
            <HighlightedText
              text={_ && _.name}
              highlightText={filterState.employeeName}
            />
          );
        },
      },
      {
        title: "Mã khách hàng",
        dataIndex: "CustomerId",
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.customerId}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    customerId: target.value,
                  });
                }}
              />
            );
          }

          return (
            <HighlightedText text={_} highlightText={filterState.customerId} />
          );
        },
      },

      {
        title: "Xử lí",
        width: 120,
        fixed: "right",
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return (
              <ReceiveButton
                open={rowData.id == receiveOpenId}
                setOpen={(id) => {
                  setReceiveOpenId(id);
                  //console.log(id);
                }}
                billId={rowData.id}
                size="small"
              />
            );
          }
        },
      },
    ]);

    return () => {};
  }, [filterState, receiveOpenId]);

  useEffect(() => {
    loadAllData();
    return () => {};
  }, []);

  useEffect(() => {
    handleUpliedFilters();

    return () => {};
  }, [filterState, data]);

  async function loadAllData() {
    setIsLoading(true);

    let res = await billApi.getLimitBill(1, 1000);

    if (res.isSuccess) {
      dispatch(setBills(res.bills));
    } else {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
    setIsLoading(false);
  }

  function handleUpliedFilters() {
    setIsLoading(true);
    if (data) {
      let _list = [...data];

      if (filterState.id) {
        _list = _list.filter((item) => {
          let id = item.id?.toLowerCase();
          let searchInput = filterState.id?.toLowerCase();

          if (id?.includes(searchInput)) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (filterState.employeeId) {
        _list = _list.filter((item) => {
          let employeeId = item.EmployeeId?.toLowerCase();
          let searchInput = filterState.employeeId?.toLowerCase();

          if (employeeId?.includes(searchInput)) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (filterState.employeeName) {
        _list = _list.filter((item) => {
          let employeeName = item.Employee?.name?.toLowerCase();
          let searchInput = filterState.employeeName?.toLowerCase();

          if (employeeName?.includes(searchInput)) {
            return true;
          } else {
            return false;
          }
        });
      }

      if (filterState.customerId) {
        _list = _list.filter((item) => {
          let customerId = item.CustomerId?.toLowerCase();
          let searchInput = filterState.customerId?.toLowerCase();

          if (customerId?.includes(searchInput)) {
            return true;
          } else {
            return false;
          }
        });
      }

      setTimeout(() => {
        setDataAfterFilted(
          (_list || []).map((item, index) => {
            return {
              ...item,
              index: index + 1,
            };
          })
        );
        setIsLoading(false);
      }, 100);
    } else {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let startIndex = pageState.limit * (pageState.page - 1);
    let endIndex = startIndex + pageState.limit;
    let _dataTable = dataAfterFilted.slice(startIndex, endIndex);
    _dataTable.unshift({
      isFirstRow: true,
    });
    setDataTable(_dataTable);

    return () => {};
  }, [pageState]);

  useEffect(() => {
    setPageState({
      page: 1,
      limit: 10,
      total: dataAfterFilted && dataAfterFilted.length,
    });

    return () => {};
  }, [dataAfterFilted]);

  function onChangePageNumber(pageNumber) {
    setIsLoading(true);
    setTimeout(() => {
      setPageState({
        ...pageState,
        page: pageNumber,
      });
      setIsLoading(false);
    }, 100);
  }

  useEffect(() => {
    if (refresh) {
      loadAllData();
    }

    return () => {};
  }, [refresh]);

  function onRowIdClick(row) {
    dispatch(
      setOpen({
        name: "BillCUModal",
        modalState: {
          visible: true,
          type: "update",
          idSelected: row.id,
        },
      })
    );
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
            Danh sách hóa đơn{" "}
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
        dataSource={dataTable}
        size="small"
        scroll={{
          x: allColumns.filter((item) => !item.hidden).length * 150,
          y: window.innerHeight * 0.66,
        }}
        className="table"
        pagination={false}
        loading={isLoading}
      />
      <div className="pagination__container">
        <Pagination
          onChange={onChangePageNumber}
          total={pageState.total}
          pageSize={pageState.limit}
          current={pageState.page}
          hideOnSinglePage
        />
      </div>
    </div>
  );
};

export default Bill;
