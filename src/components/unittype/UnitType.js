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
import "../../assets/styles/unittype.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import unitTypeApi from "./../../api/unitTypeApi";
import DropSelectColum from "./../product/DropSelectColum";
import { setUnitTypes } from "../../store/slices/unitTypeSlice";
import { setOpen } from "../../store/slices/modalSlice";

const UnitType = ({}) => {
  const {
    unitTypes = [],
    refresh,
    count = 0,
  } = useSelector((state) => state.unitType);
  const { modalState } = useSelector(
    (state) => state.modal.modals["UnitTypeCUModal"]
  );
  const { isAdmin } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  function setModalState(state) {
    dispatch(
      setOpen({
        name: "UnitTypeCUModal",
        modalState: state,
      })
    );
  }

  const [pageState, setPageState] = useState({
    page: 1,
    limit: 10,
  });

  const [allColumns, setAllColumns] = useState([
    {
      title: "Mã",
      dataIndex: "id",
      fixedShow: true,
      render: (_, row) => (
        <Typography.Link
          onClick={() => {
            setModalState({
              type: isAdmin ? "update" : "view",
              visible: true,
              idSelected: row.id,
            });
          }}
        >
          {row.id}
        </Typography.Link>
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      fixedShow: true,
    },
    {
      title: "Đơn vị quy đổi",
      dataIndex: "convertionQuantity",
    },
  ]);

  useEffect(() => {
    getUnitTypes(pageState.page, pageState.limit);
    return () => {};
  }, [pageState.page]);

  useEffect(() => {
    if (refresh) {
      getUnitTypes(pageState.page, pageState.limit);
    }

    return () => {};
  }, [refresh]);

  async function getUnitTypes(page, limit) {
    let res = await unitTypeApi.getMany(page, limit);
    if (res.isSuccess) {
      console.log(res);
      dispatch(setUnitTypes(res.unitTypes));
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
    <div className="unitType">
      <div className="products">
        <div className="table__header">
          <div className="left">
            <Typography.Title
              level={4}
              style={{
                margin: 0,
              }}
            >
              Danh sách đơn vị tính
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
                    type: "create",
                    visible: true,
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
          dataSource={unitTypes}
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
      </div>
    </div>
  );
};

export default UnitType;
