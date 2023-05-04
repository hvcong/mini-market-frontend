import {
  Button,
  Col,
  Dropdown,
  Image,
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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import productApi from "./../../api/productApi";
import { setProducts } from "../../store/slices/productSlice";
import ExpandRowRender from "./ExpandRowRender";
import DropSelectColum from "./DropSelectColum";
import ProductDetailModal from "./ProductDetailModal";
import StoreTransationDetailModal from "./../StoreTransationDetailModal";
import HighlightedText from "../HighlightedText";

const { Text } = Typography;

const AdminProducts = ({}) => {
  const {
    products = [],
    count,
    refresh,
  } = useSelector((state) => state.product);

  const { isAdmin } = useSelector((state) => state.user);
  const [modalState, setModalState] = useState({
    visible: false,
    type: "",
    rowSelected: null,
  });

  let data = products;

  const [dataAfterFilted, setDataAfterFilted] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [dataTable, setDataTable] = useState([{ isFirstRow: true }]);
  const [allColumns, setAllColumns] = useState([]);

  const [filterState, setFilterState] = useState({
    id: "",
    name: "",
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
        title: "Mã SP",
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
                  type: isAdmin ? "update" : "view",
                  visible: true,
                  rowSelected: rowData,
                });
              }}
            >
              <HighlightedText text={_} highlightText={filterState.id} />
            </Typography.Link>
          );
        },
      },
      {
        title: "Tên",
        dataIndex: "name",
        width: 200,
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
        title: "Hình ảnh",
        dataIndex: "images",
        width: 200,
        render: (images) => {
          return (
            <div>
              {images &&
                images.map((image) => {
                  return (
                    <Image
                      width={36}
                      height={36}
                      src={image.uri}
                      style={{
                        border: "1px solid #ccc",
                      }}
                    />
                  );
                })}
            </div>
          );
        },
      },

      {
        title: "Nhóm sản phẩm",
        dataIndex: "SubCategory",
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return _?.name;
          }
        },
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        render: (description) => {
          return description && description.slice(0, 50) + "...";
        },
      },

      {
        title: "Trạng thái",
        dataIndex: "state",
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return _ ? (
              <div style={{ color: "green" }}>Đang kinh doanh</div>
            ) : (
              <div style={{ color: "red" }}>Đã ngưng</div>
            );
          }
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

    let res = await productApi.getMany(1, 1000);

    if (res.isSuccess) {
      dispatch(setProducts(res.products));
    } else {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
    setIsLoading(false);
  }

  function handleUpliedFilters() {
    setIsLoading(true);
    if (data) {
      let _list = [...data];

      let [...filterNames] = Object.keys(filterState);
      filterNames.map((key) => {
        if (filterState[key]) {
          _list = _list.filter((item) => {
            let text = item[key]?.toLowerCase();
            let searchInput = filterState[key]?.toLowerCase();

            if (text?.includes(searchInput)) {
              return true;
            } else {
              return false;
            }
          });
        }
      });

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

  function clearFilter() {
    setFilterState({});
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
        {isAdmin && (
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
        )}
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
      <ProductDetailModal
        modalState={modalState}
        setModalState={setModalState}
      />
    </div>
  );
};

export default AdminProducts;
