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
import ProductDetailModal from "./ProductDetailModal";
import DropSelectColum from "../../components/product/DropSelectColum";
import ModalCustomer from "../../components/ModalCustomer";
import ExpandRowRender from "../../components/product/ExpandRowRender";
import StoreTransationDetailModal from "../../components/StoreTransationDetailModal";
import productApi from "../../api/productApi";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../store/slices/productSlice";
import cateApi from "./../../api/cateApi";
const { Text } = Typography;

const AdminProducts = ({}) => {
  const product = useSelector((state) => state.product);
  const { products = [], count, refresh } = product;
  const dispatch = useDispatch();

  const [pageState, setPageState] = useState({
    page: 1,
    limit: 10,
  });
  const [
    isShowStoreTransactionDetailModal,
    setIsShowStoreTransactionDetailModal,
  ] = useState(false);
  const [idTransactionSelected, setIdTransactionSelected] = useState(null);
  const [modalState, setModalState] = useState({
    visible: false,
    type: "",
    rowSelected: null,
  });

  const [allColumns, setAllColumns] = useState([
    {
      title: "Id",
      dataIndex: "id",
      width: 100,
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
      title: "Số lượng",
      dataIndex: "quantity",
    },

    {
      title: "Đơn vị tính",
      dataIndex: "unitType",
    },
    {
      title: "Nhóm sản phẩm",
      dataIndex: "category",
      render: (_, SubCategory) => {
        return SubCategory.name;
      },
    },
    {
      title: "Đơn giá hiện tại",
      dataIndex: "price",
      className: "colum-money",
      align: "right",
      hidden: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      render: (_, product) => (
        <Switch
          checkedChildren="On"
          unCheckedChildren="Off"
          defaultChecked={product.state}
        />
      ),
    },
  ]);

  useEffect(() => {
    getProducts(pageState.page, pageState.limit);
    return () => {};
  }, [pageState]);

  useEffect(() => {
    if (refresh) {
      console.log("re-fresh");
      getProducts(pageState.page, pageState.limit);
    }
    return () => {};
  }, [refresh]);

  async function getProducts(page, limit) {
    let hidingLoading = message.loading("Tải dữ liệu sản phẩm...");
    const res = await productApi.getMany(page, limit);
    dispatch(setProducts(res));
    hidingLoading();
  }

  // expand when click row
  function expandedRowRender(rowData) {
    return (
      <ExpandRowRender
        rowData={rowData}
        modalState={modalState}
        setModalState={setModalState}
      />
    );
  }

  // pagination handle
  function onChangePageNumber(pageNumber, pageSize) {
    setPageState(pageNumber, pageSize);
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
            Danh sách sản phẩm{" "}
          </Typography.Title>
        </div>
        <div className="btn__item">
          <Button
            size="small"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setModalState({
                ...modalState,
                visible: true,
                type: "create",
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
        dataSource={products.map((item) => {
          return {
            ...item,
            key: item.id,
          };
        })}
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
        <Pagination
          onChange={onChangePageNumber}
          total={count}
          defaultCurrent={pageState.page}
          hideOnSinglePage
        />
      </div>
      <ProductDetailModal
        modalState={modalState}
        setModalState={setModalState}
      />

      <StoreTransationDetailModal
        visible={isShowStoreTransactionDetailModal}
        setVisible={setIsShowStoreTransactionDetailModal}
        idTransactionSelected={idTransactionSelected}
      />
    </div>
  );
};

export default AdminProducts;
