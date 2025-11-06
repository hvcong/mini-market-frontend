import {
  PlusOutlined
} from "@ant-design/icons";
import {
  Button,
  Image,
  Input,
  message,
  Pagination,
  Table,
  Typography
} from "antd";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../store/slices/productSlice";
import HighlightedText from "../HighlightedText";
import productApi from "./../../api/productApi";
import DropSelectColum from "./DropSelectColum";
import ProductDetailModal from "./ProductDetailModal";

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

  const handleFilterChange = useCallback((field, value) => {
    setFilterState(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleModalOpen = useCallback((type, rowData = null) => {
    setModalState({
      type,
      visible: true,
      rowSelected: rowData,
    });
  }, []);

  const columns = useMemo(() => [
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
              onChange={({ target }) => handleFilterChange('id', target.value)}
            />
          );
        }

        return (
          <Typography.Link
            onClick={() => handleModalOpen(isAdmin ? "update" : "view", rowData)}
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
              onChange={({ target }) => handleFilterChange('name', target.value)}
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
              images.map((image, idx) => {
                return (
                  <Image
                    key={idx}
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
  ], [filterState, isAdmin, handleFilterChange, handleModalOpen]);

  useEffect(() => {
    setAllColumns(columns);
  }, [columns]);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);

    let res = await productApi.getMany(1, 1000);

    if (res.isSuccess) {
      dispatch(setProducts(res.products));
    } else {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleUpliedFilters = useCallback(() => {
    setIsLoading(true);
    if (products) {
      let _list = [...products];

      let [...filterNames] = Object.keys(filterState);
      filterNames.forEach((key) => {
        if (filterState[key]) {
          _list = _list.filter((item) => {
            let text = item[key]?.toLowerCase();
            let searchInput = filterState[key]?.toLowerCase();

            return text?.includes(searchInput);
          });
        }
      });

      setTimeout(() => {
        setDataAfterFilted(
          (_list || []).map((item, index) => ({
            ...item,
            index: index + 1,
          }))
        );
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false);
    }
  }, [products, filterState]);

  useEffect(() => {
    handleUpliedFilters();
  }, [handleUpliedFilters]);

  const currentPageData = useMemo(() => {
    let startIndex = pageState.limit * (pageState.page - 1);
    let endIndex = startIndex + pageState.limit;
    let _dataTable = dataAfterFilted.slice(startIndex, endIndex);
    _dataTable.unshift({
      isFirstRow: true,
    });
    return _dataTable;
  }, [dataAfterFilted, pageState.limit, pageState.page]);

  useEffect(() => {
    setDataTable(currentPageData);
  }, [currentPageData]);

  useEffect(() => {
    setPageState({
      page: 1,
      limit: 10,
      total: dataAfterFilted && dataAfterFilted.length,
    });
  }, [dataAfterFilted]);

  const onChangePageNumber = useCallback((pageNumber) => {
    setIsLoading(true);
    setTimeout(() => {
      setPageState(prev => ({
        ...prev,
        page: pageNumber,
      }));
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (refresh) {
      loadAllData();
    }
  }, [refresh, loadAllData]);

  const visibleColumns = useMemo(() => 
    allColumns.filter((col) => !col.hidden),
    [allColumns]
  );

  const scrollConfig = useMemo(() => ({
    x: visibleColumns.length * 180,
    y: window.innerHeight * 0.66,
  }), [visibleColumns.length]);

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
              onClick={() => handleModalOpen("create")}
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

      <Table
        columns={visibleColumns}
        dataSource={dataTable}
        pagination={false}
        size="small"
        scroll={scrollConfig}
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
