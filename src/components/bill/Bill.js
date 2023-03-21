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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import productApi from "./../../api/productApi";
import { setProducts } from "../../store/slices/productSlice";
import DropSelectColum from "./../product/DropSelectColum";
import BillCUModal from "./BillCUModal";
import StoreTransationDetailModal from "./../StoreTransationDetailModal";

const { Text } = Typography;

const Bill = ({}) => {
  const product = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const [
    isShowStoreTransactionDetailModal,
    setIsShowStoreTransactionDetailModal,
  ] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const [idTransactionSelected, setIdTransactionSelected] = useState(null);
  const [typeOfModal, setTypeOfModal] = useState("update");
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
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
    },

    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      render: (_, price) => (
        <Switch
          checkedChildren="On"
          unCheckedChildren="Off"
          defaultChecked={price.acitve}
        />
      ),
    },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
    async function getProducts() {
      const res = await productApi.getMany();
      dispatch(setProducts(res.rows));
    }
    return () => {};
  }, []);

  //table handle render
  const dataSource = [];
  // for (let i = 1; i <= 10; i++) {
  //   dataSource.push({
  //     key: i,
  //     id: "PR-" + i,
  //     title: "Bảng giá mùa xuân",
  //     startDate: "10/2/2022",
  //     endDate: "23/2/2023",
  //     acitve: i % 2 == 0,
  //   });
  // }

  // pagination handle
  function onChangePageNumber(pageNumber, pageSize) {
    console.log(pageNumber, ",", pageSize);
  }

  // open storetransactionDetail modal with id
  function openStoreTrDetailModal(id) {
    setIdTransactionSelected(id);
    setIsShowStoreTransactionDetailModal(true);
  }

  // on click row
  function onRowIdClick(row) {
    setIdSelected(row.id);
    setTypeOfModal("update");
    setIsShowDetailModal(true);
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
            Danh sách hóa đơn{" "}
          </Typography.Title>
        </div>
        <div className="btn__item">
          <Button
            size="small"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              navigate("/bills/create");
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
        dataSource={dataSource}
        pagination={false}
        size="small"
        scroll={{
          x: allColumns.filter((item) => !item.hidden).length * 150,
          y: window.innerHeight * 0.66,
        }}
        className="table"
      />
      <div className="pagination__container">
        {/* <Pagination onChange={onChangePageNumber} total={100} /> */}
      </div>
      <BillCUModal
        visible={isShowDetailModal}
        setVisible={() => {
          setIsShowDetailModal(false);
          setIdSelected(null);
        }}
        idSelected={idSelected}
        typeOfModal={typeOfModal}
      />

      <StoreTransationDetailModal
        visible={isShowStoreTransactionDetailModal}
        setVisible={setIsShowStoreTransactionDetailModal}
        idTransactionSelected={idTransactionSelected}
      />
    </div>
  );
};

export default Bill;
