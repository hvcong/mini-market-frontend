import {
  Button,
  Col,
  Dropdown,
  Input,
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
import { convertToVND, sqlToDDmmYYY } from "./../../utils/index";
import DropSelectColum from "./../product/DropSelectColum";
import promotionApi from "./../../api/promotionApi";
import billApi from "./../../api/billApi";
import { setBills } from "../../store/slices/billSlice";
import BillCUModal from "../bill/BillCUModal";
import { setReceiveBills } from "../../store/slices/receiveBillSlice";
import { setOpen } from "../../store/slices/modalSlice";
import HighlightedText from "../HighlightedText";

const { Text } = Typography;

const ReceiveBill = ({}) => {
  const { receiveBills, refresh, count } = useSelector(
    (state) => state.receiveBill
  );

  const modalState = useSelector((state) => state.modal.modals.BillCUModal);

  let data = receiveBills;

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
        title: "Mã hóa đơn",
        dataIndex: "",
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
              <HighlightedText
                text={rowData.BillId}
                highlightText={filterState.id}
              />
            </Typography.Link>
          );
        },
      },

      {
        title: "Mã nhân viên",
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
            <HighlightedText
              text={rowData.Bill?.EmployeeId}
              highlightText={filterState.employeeId}
            />
          );
        },
      },
      {
        title: "Tên nhân viên",
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
              text={rowData.Bill?.Employee?.name}
              highlightText={filterState.employeeName}
            />
          );
        },
      },
      {
        title: "Mã khách hàng",

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
            <HighlightedText
              text={rowData.Bill?.CustomerId}
              highlightText={filterState.customerId}
            />
          );
        },
      },
      {
        title: "Tên khách hàng",
        render: (_, rowData) => {
          //console.log(rowData.Bill?.Customer);
          let firstName =
            (rowData.Bill?.Customer.firstName &&
              rowData.Bill?.Customer.firstName + " ") ||
            " ";
          let lastName =
            rowData.Bill?.Customer.lastName &&
            rowData.Bill?.Customer.lastName + " " + " ";
          let name = firstName || "" + lastName || "";
          //console.log(firstName, lastName);

          if (name) {
            name = name.trim();
          }
          return (
            <Typography.Link
              onClick={() => {
                dispatch(
                  setOpen({
                    name: "CustomerCUModal",
                    modalState: {
                      visible: true,
                      type: "view",
                      idSelected: rowData.Bill?.Customer.id,
                    },
                  })
                );
              }}
            >
              {name || rowData.Bill?.Customer.phonenumber}
            </Typography.Link>
          );
        },
      },
      {
        title: "Ngày trả",
        dataIndex: "createAt",
        render: (createAt, rowData) => {
          if (!rowData.isFirstRow) {
            return sqlToDDmmYYY(createAt);
          }
        },
      },
      {
        title: "Tổng tiền",
        align: "right",
        render: (_, rowData) => {
          let cost = rowData.Bill?.cost;
          return convertToVND(cost);
        },
      },

      {
        title: "Ghi chú trả hàng",
        dataIndex: "note",
        width: 240,
      },
    ]);

    return () => {};
  }, [filterState]);

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

    let res = await billApi.getLimitReceives(1, 1000);

    if (res.isSuccess) {
      dispatch(setReceiveBills(res.retrieves));
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
          let id = item.BillId?.toLowerCase();
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
          let employeeId = item.Bill?.EmployeeId?.toLowerCase();
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
          let employeeName = item.Bill?.Employee?.name?.toLowerCase();
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
          let customerId = item?.Bill.CustomerId?.toLowerCase();
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
    setModalState({
      type: "view-retrieve",
      visible: true,
      idSelected: row.BillId,
    });
  }

  function setModalState(state) {
    dispatch(
      setOpen({
        name: "BillCUModal",
        modalState: state,
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
        dataSource={dataTable}
        pagination={false}
        size="small"
        scroll={{
          x: allColumns.filter((item) => !item.hidden).length * 150,
          y: window.innerHeight * 0.66,
        }}
        className="table"
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
      <BillCUModal modalState={modalState} setModalState={setModalState} />
    </div>
  );
};

export default ReceiveBill;
