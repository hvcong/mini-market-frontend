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
} from "@ant-design/icons";
import "../../assets/styles/customer.scss";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import priceHeaderApi from "./../../api/priceHeaderApi";
import { setPriceHeaders } from "../../store/slices/priceHeaderSlice";
import DropSelectColum from "./../product/DropSelectColum";
import CustomerCUModal from "./CustomerCUModal";
import userApi from "./../../api/userApi";
import { setCustomers } from "../../store/slices/customerSlice";
import { setOpen } from "../../store/slices/modalSlice";
import HighlightedText from "../HighlightedText";

const { Text } = Typography;

const Customer = ({}) => {
  const { customers, refresh, count } = useSelector((state) => state.customer);
  const modalState = useSelector(
    (state) => state.modal.modals["CustomerCUModal"]
  );
  let data = customers;

  const [dataAfterFilted, setDataAfterFilted] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [dataTable, setDataTable] = useState([{ isFirstRow: true }]);
  const [allColumns, setAllColumns] = useState([]);

  const [filterState, setFilterState] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phonenumber: "",
  });

  const [pageState, setPageState] = useState({
    page: 1,
    limit: 10,
    total: 20,
  });

  useEffect(() => {
    setAllColumns([
      {
        title: "STT",
        width: 44,
        fixed: "left",
        dataIndex: "index",
      },

      {
        title: "Mã KH",
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
                setModalState({
                  type: "update",
                  visible: true,
                  idSelected: rowData.id,
                });
              }}
            >
              <HighlightedText text={_} highlightText={filterState.id} />
            </Typography.Link>
          );
        },
      },
      {
        title: "Họ /tên đệm",
        dataIndex: "firstName",
        width: 160,
        fixedShow: true,
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.firstName}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    firstName: target.value,
                  });
                }}
              />
            );
          }

          return (
            <HighlightedText text={_} highlightText={filterState.firstName} />
          );
        },
      },
      {
        title: "Tên",
        dataIndex: "lastName",
        width: 160,
        fixedShow: true,
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.lastName}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    lastName: target.value,
                  });
                }}
              />
            );
          }

          return (
            <HighlightedText text={_} highlightText={filterState.lastName} />
          );
        },
      },
      {
        title: "Số điện thoại",
        dataIndex: "phonenumber",
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.phonenumber}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    phonenumber: target.value,
                  });
                }}
              />
            );
          }

          return (
            <HighlightedText text={_} highlightText={filterState.phonenumber} />
          );
        },
      },
      {
        title: "Nhóm khách hàng",
        width: 200,
        dataIndex: "groupId",
        render: (_, rowData) => {
          return rowData.TypeCustomer && rowData.TypeCustomer.name;
        },
      },

      {
        title: "Địa chỉ",
        width: 260,
        dataIndex: "address",
        render: (_, rowData) => {
          if (
            rowData.HomeAddress &&
            rowData.HomeAddress.Ward &&
            rowData.HomeAddress.Ward.District &&
            rowData.HomeAddress.Ward.District.City
          ) {
            let _addr = rowData.HomeAddress.homeAddress;
            _addr += ", " + rowData.HomeAddress.Ward.name;
            _addr += ", " + rowData.HomeAddress.Ward.District.name;
            _addr += ", " + rowData.HomeAddress.Ward.District.City.name;
            return _addr;
          }
          return "";
        },
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

    let res = await userApi.getLimitCustomers(1, 1000);

    if (res.isSuccess) {
      dispatch(setCustomers(res.customers));
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
      if (filterState.firstName) {
        _list = _list.filter((item) => {
          let firstName = item.firstName?.toLowerCase();
          let searchInput = filterState.firstName?.toLowerCase();

          if (firstName?.includes(searchInput)) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (filterState.lastName) {
        _list = _list.filter((item) => {
          let lastName = item.lastName?.toLowerCase();
          let searchInput = filterState.lastName?.toLowerCase();

          if (lastName?.includes(searchInput)) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (filterState.phonenumber) {
        _list = _list.filter((item) => {
          let phonenumber = item.phonenumber?.toLowerCase();
          let searchInput = filterState.phonenumber?.toLowerCase();

          if (phonenumber?.includes(searchInput)) {
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

  function clearFilter() {
    setFilterState({});
  }
  function setModalState(state) {
    dispatch(
      setOpen({
        name: "CustomerCUModal",
        modalState: state,
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
            Danh sách khách hàng{" "}
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
        dataSource={dataTable}
        pagination={false}
        size="small"
        scroll={{
          x: allColumns.filter((item) => !item.hidden).length * 180,
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
    </div>
  );
};

export default Customer;
