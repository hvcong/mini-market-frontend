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
import productApi from "./../../api/productApi";
import { setProducts } from "../../store/slices/productSlice";
import ExpandRowRender from "./ExpandRowRender";
import DropSelectColum from "./DropSelectColum";
import ProductDetailModal from "./ProductDetailModal";
import StoreTransationDetailModal from "./../StoreTransationDetailModal";

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
      render: (_, rowData) => {
        return (
          <Typography.Link
            onClick={() => {
              setModalState({
                type: "update",
                visible: true,
                rowSelected: rowData,
              });
            }}
          >
            {rowData.id}
          </Typography.Link>
        );
      },
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
      hidden: true,
    },
    {
      title: "Nhóm sản phẩm",
      dataIndex: "category",
      render: (_, product) => {
        return product.SubCategory.name;
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "active",
      render: (_, product) => (
        <>
          {product.state ? (
            <div style={{ color: "green" }}>Đang kinh doanh</div>
          ) : (
            <div style={{ color: "red" }}>Đã ngưng</div>
          )}
        </>
      ),
    },
  ]);

  useEffect(() => {
    console.log(pageState);
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
    dispatch(setProducts(res.products));
    hidingLoading();
  }

  // expand when click row
  // function expandedRowRender(rowData) {
  //   return (
  //     <ExpandRowRender
  //       rowData={rowData}
  //       modalState={modalState}
  //       setModalState={setModalState}
  //     />
  //   );
  // }

  // pagination handle
  function onChangePageNumber(pageNumber, pageSize) {
    setPageState({
      page: pageNumber,
      limit: pageSize,
    });
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
        // expandable={{
        //   expandedRowRender,
        //   expandRowByClick: true,
        // }}
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
    </div>
  );
};

export default AdminProducts;
