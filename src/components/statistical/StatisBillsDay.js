import {
  Button,
  DatePicker,
  Input,
  Pagination,
  Popover,
  Spin,
  Table,
  Typography,
  message,
} from "antd";
import React from "react";
import DropSelectColum from "../product/DropSelectColum";
import { PlusOutlined } from "@ant-design/icons";
import {
  convertToVND,
  getStartToDay,
  sortData,
  sqlToAntd,
  sqlToDDmmYYY,
} from "../../utils";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImportExcelButton from "../common/ImportExcelButton";
import DownLoadTemplate from "../common/DownLoadTemplate";
import ExportExcelButton from "../common/ExportExcelButton";
import { useEffect } from "react";
import promotionApi from "../../api/promotionApi";
import {
  setAllBillsCustomers,
  setAllBillsDay,
  setAllStoreInputs,
} from "../../store/slices/statisticSlice";
import statisApi from "../../api/statisApi";
import DatePickerCustom from "../promotion/DatePickerCustom";
import HighlightedText from "../HighlightedText";

const StatisBillsDay = () => {
  const { data, refresh } = useSelector((state) => state.statis.allBillsDay);
  //console.log(data);

  const [dataAfterFilted, setDataAfterFilted] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  let hideLoading = null;

  const [dataTable, setDataTable] = useState([{ isFirstRow: true }]);
  const [allColumns, setAllColumns] = useState([]);

  const [filterState, setFilterState] = useState({
    fromDate: getStartToDay(),
    toDate: new Date(),
    customerId: "",
    typeCustomer: "",
  });

  const [pageState, setPageState] = useState({
    page: 1,
    limit: 10,
    total: 20,
  });

  function clearFilter() {
    setFilterState({
      fromDate: getStartToDay(),
      toDate: new Date(),
    });
  }

  useEffect(() => {
    setAllColumns([
      {
        title: "STT",
        width: 44,
        dataIndex: "index",
      },

      {
        title: "Mã NVBH",
        dataIndex: "employeeId",
        width: 160,
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.employeeId}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    employeeId: target.value,
                  });
                }}
              />
            );
          }
          return (
            <HighlightedText text={_} highlightText={filterState.employeeId} />
          );
        },
      },

      {
        title: "Tên NVBH",
        dataIndex: "employeeName",
        width: 160,
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.employeeName}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    employeeName: target.value,
                  });
                }}
              />
            );
          }
          return (
            <HighlightedText
              text={_}
              highlightText={filterState.employeeName}
            />
          );
        },
      },
      {
        title: "Ngày",
        dataIndex: "orderDate",
        width: 160,
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return sqlToDDmmYYY(_);
          }
        },
      },
      {
        title: "Chiết khấu",
        dataIndex: "discount",
        align: "right",
        width: 160,
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return convertToVND(_);
          }
        },
      },
      {
        title: "Doanh số trước CK",
        dataIndex: "beforeDiscount",
        align: "right",
        width: 160,
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return convertToVND(_);
          }
        },
      },
      {
        title: "Doanh số sau CK",
        dataIndex: "cost",
        align: "right",
        width: 160,
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return convertToVND(_);
          }
        },
      },
    ]);

    return () => {};
  }, [filterState]);

  useEffect(() => {
    loadAllData();
    return () => {};
  }, [filterState.fromDate, filterState.toDate]);

  useEffect(() => {
    handleUpliedFilters();

    return () => {};
  }, [filterState, data]);

  async function loadAllData() {
    setIsLoading(true);

    let res = await statisApi.getAllByEmployee({
      fromDate: filterState.fromDate,
      toDate: filterState.toDate,
    });

    if (res.isSuccess) {
      dispatch(setAllBillsDay(sortData(res.bills, "employeeId")));
    } else {
      dispatch(setAllBillsDay([]));
    }
    setIsLoading(false);
  }

  function handleUpliedFilters() {
    setIsLoading(true);
    if (data) {
      let _list = [...data];

      if (filterState.employeeId) {
        _list = _list.filter((item) => {
          let employeeId = item.employeeId?.toLowerCase();
          let searchInput = filterState.employeeId?.toLowerCase();

          if (employeeId?.includes(searchInput)) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (filterState.employeeName) {
        _list = _list.filter((item) => {
          let employeeName = item.employeeName?.toLowerCase();
          let searchInput = filterState.employeeName?.toLowerCase();

          if (employeeName?.includes(searchInput)) {
            return true;
          } else {
            return false;
          }
        });
      }

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
      }, 100);
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
    setPageState({
      ...pageState,
      page: pageNumber,
    });
  }

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, []);

  return (
    <div className="statis_container">
      <div className="products">
        <div className="table__header">
          <div className="left">
            <Typography.Title
              level={4}
              style={{
                margin: 0,
              }}
            >
              Danh sách thống kê
              {/* {isLoading && (
                <Spin
                  style={{
                    marginLeft: 12,
                  }}
                />
              )} */}
            </Typography.Title>
          </div>
          <div className="btn__item">
            <DatePickerCustom
              value={[filterState.fromDate, filterState.toDate]}
              onChangeDate={(strings) => {
                if (strings && strings[0] && strings[1]) {
                  setFilterState({
                    ...filterState,
                    fromDate: strings[0],
                    toDate: strings[1],
                  });
                } else {
                  setFilterState({
                    ...filterState,
                    fromDate: getStartToDay(),
                    toDate: new Date(),
                  });
                }
              }}
            />
          </div>
          {/* <div className="btn__item">
            <Button onClick={clearFilter} type={"primary"} danger>
              Xóa Lọc
            </Button>
          </div> */}

          <div className="btn__item">
            <ExportExcelButton
              data={dataAfterFilted.map((item) => {
                return {
                  index: item.index,
                  employeeId: item.employeeId,
                  employeeName: item.employeeName,
                  orderDate: sqlToDDmmYYY(item.orderDate),
                  discount: item.discount,
                  beforeDiscount: item.beforeDiscount,
                  cost: item.cost,
                };
              })}
              nameTemplate={"StatisBillsDay"}
              headerNameList={allColumns}
              fromDate={filterState.fromDate}
              toDate={filterState.toDate}
              sta
            />
          </div>
          <div className="btn__item">
            <DropSelectColum
              allColumns={allColumns}
              setAllColumns={setAllColumns}
            />
          </div>
        </div>
      </div>

      {/* table */}

      <Table
        columns={allColumns}
        dataSource={dataTable}
        size="small"
        scroll={{
          x: allColumns.filter((item) => !item.hidden).length * 150,
          y: window.innerHeight * 0.66,
        }}
        className="table"
        pagination={false}
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
    </div>
  );
};

export default StatisBillsDay;
