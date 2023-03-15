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
import ProductDetailModal from "../product/ProductDetailModal";
import DropSelectColum from "../../components/product/DropSelectColum";
import ModalCustomer from "../../components/ModalCustomer";
import ExpandRowRender from "../../components/customer/ExpandRowRender";
import StoreTransationDetailModal from "../../components/StoreTransationDetailModal";
import productApi from "../../api/productApi";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../store/slices/productSlice";
const { Text } = Typography;

const Customer = ({}) => {
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
      title: "Mã khách hàng",
      dataIndex: "id",
      width: 200,
      fixed: "left",
      fixedShow: true,
    },
    {
      title: "Tên",
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
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Hạng",
      dataIndex: "pointAchive",
    },
  ]);

  useEffect(() => {
    getProducts();
    async function getProducts() {
      const res = await productApi.getMany();
      dispatch(setProducts(res.rows));
    }
    return () => {};
  }, []);

  //table handle render
  //table handle render
  const dataSource = [];
  for (let i = 1; i <= 10; i++) {
    dataSource.push({
      key: i,
      id: "KH-" + i,
      name: "Hoang van Cong",
      phonenumber: "0934342312321",
      email: "hvcong@gmail.com",
      pointAchive: "Vang",
    });
  }

  // expand when click row
  function expandedRowRender(rowData) {
    return (
      <ExpandRowRender
        rowData={rowData}
        setIsShowDetailModal={setIsShowDetailModal}
      />
    );
  }

  // pagination handle
  function onChangePageNumber(pageNumber, pageSize) {
    console.log(pageNumber, ",", pageSize);
  }

  // open storetransactionDetail modal with id
  function openStoreTrDetailModal(id) {
    setIdTransactionSelected(id);
    setIsShowStoreTransactionDetailModal(true);
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
              setIsShowDetailModal(true);
              setTypeOfModal("create");
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
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              console.log(record);
              // setIdSelected(record.id);
              // setTypeOfModal("update");
            },
          };
        }}
        expandable={{
          expandedRowRender,
          expandRowByClick: true,
        }}
        className="table"
      />
      <div className="pagination__container">
        <Pagination onChange={onChangePageNumber} total={100} />
      </div>
      <ProductDetailModal
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

export default Customer;
