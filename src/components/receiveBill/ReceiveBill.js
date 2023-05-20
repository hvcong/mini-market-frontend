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
import { convertToVND, sqlToDDmmYYY } from "./../../utils/index";
import DropSelectColum from "./../product/DropSelectColum";
import promotionApi from "./../../api/promotionApi";
import billApi from "./../../api/billApi";
import { setBills } from "../../store/slices/billSlice";
import BillCUModal from "../bill/BillCUModal";
import { setReceiveBills } from "../../store/slices/receiveBillSlice";
import { setOpen } from "../../store/slices/modalSlice";

const { Text } = Typography;

const ReceiveBill = ({}) => {
  let hideLoading = null;
  const { receiveBills, refresh, count } = useSelector(
    (state) => state.receiveBill
  );

  const modalState = useSelector((state) => state.modal.modals.BillCUModal);

  const dispatch = useDispatch();

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
      dataIndex: "createAt",
      render: (createAt) => {
        return sqlToDDmmYYY(createAt);
      },
    },
    {
      title: "Tổng tiền",
      align: "right",
      render: (_, rowData) => {
        let cost = rowData.Bill.cost;
        return convertToVND(cost);
      },
    },
    {
      title: "Mã nhân viên",
      render: (_, rowData) => {
        return <Typography.Link>{rowData.Bill?.EmployeeId}</Typography.Link>;
      },
      hidden: true,
    },
    {
      title: "Tên nhân viên",
      render: (_, rowData) => {
        return rowData.Bill.Employee?.name;
      },
    },
    {
      title: "Mã khách hàng",
      hidden: true,

      render: (_, rowData) => {
        return <Typography.Link>{rowData.Bill.CustomerId}</Typography.Link>;
      },
    },
    {
      title: "Tên khách hàng",
      render: (_, rowData) => {
        //console.log(rowData.Bill.Customer);
        let firstName =
          (rowData.Bill.Customer.firstName &&
            rowData.Bill.Customer.firstName + " ") ||
          " ";
        let lastName =
          rowData.Bill.Customer.lastName &&
          rowData.Bill.Customer.lastName + " " + " ";
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
                    idSelected: rowData.Bill.Customer.id,
                  },
                })
              );
            }}
          >
            {name || rowData.Bill.Customer.phonenumber}
          </Typography.Link>
        );
      },
    },

    {
      title: "Ghi chú trả hàng",
      dataIndex: "note",
      width: 240,
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
    let res = await billApi.getLimitReceives(page, limit);
    if (res.isSuccess) {
      dispatch(setReceiveBills(res.retrieves));
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
      type: "view-retrieve",
      visible: true,
      idSelected: row.BillId,
    });
  }

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, [modalState]);

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
