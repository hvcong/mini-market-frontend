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
import "../../assets/styles/employee.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { sqlToDDmmYYY } from "../../utils/index";
import priceHeaderApi from "../../api/priceHeaderApi";
import DropSelectColum from "../product/DropSelectColum";
import { setPriceHeaders } from "../../store/slices/priceHeaderSlice";
import EmployeeCUModal from "./EmployeeCUModal";
import userApi from "./../../api/userApi";
import { setEmployees } from "../../store/slices/employeeSlice";
import { setOpen } from "../../store/slices/modalSlice";
import HighlightedText from "../HighlightedText";

const { Text } = Typography;

const Employee = ({}) => {
  const { employees, refresh } = useSelector((state) => state.employee);
  let data = employees;
  const [modalState, setModalState] = useState({
    visible: false,
  });

  const [dataAfterFilted, setDataAfterFilted] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [dataTable, setDataTable] = useState([{ isFirstRow: true }]);
  const [allColumns, setAllColumns] = useState([]);

  const [filterState, setFilterState] = useState({
    id: "",
    name: "",
    phonenumber: "",
    role: "",
  });

  const [pageState, setPageState] = useState({
    page: 1,
    limit: 10,
    total: 20,
  });

  function clearFilter() {
    setFilterState({});
  }

  useEffect(() => {
    setAllColumns([
      {
        title: "STT",
        width: 44,
        dataIndex: "index",
      },

      {
        title: "Mã nhân viên",
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
                dispatch(
                  setOpen({
                    name: "ProfileModal",
                    modalState: {
                      visible: true,
                      type: "update",
                      idSelected: rowData.id,
                    },
                  })
                );
              }}
            >
              <HighlightedText text={_} highlightText={filterState.id} />
            </Typography.Link>
          );
        },
      },
      {
        title: "Tên nhân viên",
        dataIndex: "name",
        width: 200,
        fixed: "left",
        fixedShow: true,
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.name}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    name: target.value,
                  });
                }}
              />
            );
          }

          return <HighlightedText text={_} highlightText={filterState.name} />;
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
        title: "Chức vụ",
        fixedShow: true,
        render: (_, rowData) => {
          if (rowData.Account) {
            return rowData.Account.role == "NV"
              ? "Nhân viên bán hàng"
              : "Quản lí";
          }
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

    let res = await userApi.getLimitEmployees(1, 1000);

    if (res.isSuccess) {
      dispatch(setEmployees(res.employees));
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
      if (filterState.name) {
        _list = _list.filter((item) => {
          let name = item.name?.toLowerCase();
          let searchInput = filterState.name?.toLowerCase();

          if (name?.includes(searchInput)) {
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
      }, 500);
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
    }, 500);
  }

  useEffect(() => {
    if (refresh) {
      loadAllData();
    }

    return () => {};
  }, [refresh]);

  return (
    <div className="employee">
      <div className="products">
        <div className="table__header">
          <div className="left">
            <Typography.Title
              level={4}
              style={{
                margin: 0,
              }}
            >
              Danh sách nhân viên{" "}
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
          columns={allColumns}
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
        <EmployeeCUModal
          modalState={modalState}
          setModalState={setModalState}
        />
      </div>
    </div>
  );
};

export default Employee;
