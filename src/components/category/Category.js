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
  SearchOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import cateApi from "./../../api/cateApi";
import CategoryDetailModal from "./CategoryDetailModal";
import StoreTransationDetailModal from "./../StoreTransationDetailModal";
import { setCates } from "../../store/slices/cateSlice";
import ExpandRowRender from "./ExpandRowRender";
import DropSelectColum from "./../product/DropSelectColum";

const { Text } = Typography;

const Category = ({}) => {
  const cate = useSelector((state) => state.cate);
  let { categories = [], count = 0, refresh } = cate;
  const dispatch = useDispatch();

  const [modalState, setModalState] = useState({
    visible: false,
    type: "update",
    rowSelected: null,
  });

  const [pageState, setPageState] = useState({
    current: 1,
    limit: 10,
  });

  const [
    isShowStoreTransactionDetailModal,
    setIsShowStoreTransactionDetailModal,
  ] = useState(false);
  const [idTransactionSelected, setIdTransactionSelected] = useState(null);

  // search on a column handle
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  let hideLoading = null;

  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    console.log("here", selectedKeys, confirm, dataIndex);
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (...dataIndex) => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={searchInput}
            placeholder={`Tìm theo ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: "block",
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? "#1890ff" : undefined,
            size: "14px",
          }}
        />
      ),
    };
  };
  const [allColumns, setAllColumns] = useState([
    {
      title: "Mã nhóm (c1)",
      dataIndex: "id",
      keyex: "id",
      width: 100,
      fixed: "left",
      fixedShow: true,
      render: (_, rowData) => {
        return (
          <Typography.Link
            onClick={() => {
              setModalState({
                visible: true,
                type: "update",
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
      title: "Tên nhóm (c1)",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      fixedShow: true,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Trạng thái",
      dataIndex: "state",
      key: "state",
      width: 120,
      render: (_, category) => (
        <>
          {category.state ? (
            <div style={{ color: "green" }}>Đang sử dụng</div>
          ) : (
            <div style={{ color: "red" }}>Đã ngưng</div>
          )}
        </>
      ),
    },
  ]);

  // get data
  useEffect(() => {
    getCates(pageState.page, pageState.limit);

    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, [pageState]);

  // handle when have some update will reload data
  useEffect(() => {
    if (refresh) {
      getCates(pageState.page, pageState.limit);
    }
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, [refresh]);

  async function getCates(page, limit) {
    hideLoading = message.loading("Đang tải dữ liệu nhóm hàng...", 0);
    const res = await cateApi.getMany(page, limit);
    dispatch(setCates(res.cates));
    hideLoading();
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
            Danh sách nhóm sản phẩm{" "}
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
        dataSource={
          categories &&
          categories.length &&
          categories.map((item) => ({ ...item, key: item.id }))
        }
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
          hideOnSinglePage
        />
      </div>
      <CategoryDetailModal
        modalState={modalState}
        setModalState={setModalState}
      />
    </div>
  );
};

export default Category;
