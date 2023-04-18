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

const { Text } = Typography;

const Employee = ({}) => {
  const { employees, refresh, count } = useSelector((state) => state.employee);
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
      title: "Mã nhân viên",
      dataIndex: "id",
      width: 160,
      fixed: "left",
      fixedShow: true,
      render: (_, rowData) => {
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
            {rowData.id}
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
    },
    {
      title: "Số điện thoại",
      dataIndex: "phonenumber",
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

  useEffect(() => {
    getEmployees(pageState.page, pageState.limit);
    return () => {};
  }, [pageState.page]);

  useEffect(() => {
    if (refresh) {
      getEmployees(pageState.page, pageState.limit);
    }

    return () => {};
  }, [refresh]);

  async function getEmployees(page, limit) {
    let res = await userApi.getLimitEmployees(page, limit);
    console.log(res);
    if (res.isSuccess) {
      dispatch(setEmployees(res.employees));
    }
  }

  // pagination handle
  function onChangePageNumber(pageNumber, pageSize) {
    setPageState({
      page: pageNumber,
      limit: pageSize,
    });
  }

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
          columns={allColumns.filter((col) => !col.hidden)}
          dataSource={employees}
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
        <EmployeeCUModal
          modalState={modalState}
          setModalState={setModalState}
        />
      </div>
    </div>
  );
};

export default Employee;
