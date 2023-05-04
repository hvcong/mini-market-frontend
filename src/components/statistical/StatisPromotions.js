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
  setAllPromotions,
  setAllStoreInputs,
} from "../../store/slices/statisticSlice";
import statisApi from "../../api/statisApi";
import DatePickerCustom from "../promotion/DatePickerCustom";
import HighlightedText from "../HighlightedText";

const StatisPromotions = () => {
  const { data, refresh } = useSelector((state) => state.statis.allPromotions);
  const { account } = useSelector((state) => state.user);

  const [dataAfterFilted, setDataAfterFilted] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  let hideLoading = null;

  const [dataTable, setDataTable] = useState([{ isFirstRow: true }]);
  const [allColumns, setAllColumns] = useState([]);

  const [filterState, setFilterState] = useState({
    fromDate: getStartToDay(),
    toDate: new Date(),
    promotionId: "",
    name: "",
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
        title: "",
        children: [
          {
            title: "STT",
            width: 44,
            dataIndex: "index",
          },

          {
            title: "Mã CTKM",
            dataIndex: "promotionId",
            width: 160,
            render: (_, rowData) => {
              if (rowData.isFirstRow) {
                return (
                  <Input
                    placeholder="Tìm kiếm"
                    value={filterState.promotionId}
                    allowClear
                    onChange={({ target }) => {
                      setFilterState({
                        ...filterState,
                        promotionId: target.value,
                      });
                    }}
                  />
                );
              }
              return (
                <HighlightedText
                  text={_}
                  highlightText={filterState.promotionId}
                />
              );
            },
          },

          {
            title: "Tên CTKM",
            dataIndex: "name",
            width: 200,
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
              return (
                <HighlightedText text={_} highlightText={filterState.name} />
              );
            },
          },
          {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            width: 160,
            render: (_, rowData) => {
              if (!rowData.isFirstRow) {
                return sqlToDDmmYYY(_);
              }
            },
          },
          {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            width: 160,
            render: (_, rowData) => {
              if (!rowData.isFirstRow) {
                return sqlToDDmmYYY(_);
              }
            },
          },
        ],
      },
      {
        title: "KM tặng SP",
        children: [
          {
            title: "Mã SP tặng",
            dataIndex: "giftProductId",
            width: 160,
          },
          {
            title: "Tên SP tặng",
            dataIndex: "productName",
            width: 160,
          },
          {
            title: "SL tặng",
            dataIndex: "quantityApplied",
            width: 160,
          },
          {
            title: "Đơn vị tính",
            dataIndex: "unitType",
            width: 160,
          },
        ],
      },

      {
        title: "Chiếu khấu trên SP",
        children: [
          {
            title: "Tổng tiền đã chiết khấu",
            dataIndex: "discounted",
            width: 160,
            align: "right",
            render: (_, rowData) => {
              if (!rowData.isFirstRow) {
                return convertToVND(_);
              }
            },
          },
        ],
      },
      {
        title: "Chiếu khấu trên đơn hàng",
        children: [
          {
            title: "Ngân sách tổng",
            dataIndex: "budget",
            width: 160,
            align: "right",
            render: (_, rowData) => {
              if (!rowData.isFirstRow) {
                return convertToVND(_);
              }
            },
          },
          {
            title: "Ngân sách đã sử dụng",
            dataIndex: "used",
            width: 160,
            align: "right",
            render: (_, rowData) => {
              if (!rowData.isFirstRow) {
                return convertToVND(_);
              }
            },
          },
          {
            title: "Ngân sách còn lại",
            dataIndex: "availableBudget",
            width: 160,
            align: "right",
            render: (_, rowData) => {
              if (!rowData.isFirstRow) {
                return convertToVND(_);
              }
            },
          },
        ],
      },
      {
        title: "Phiếu giảm giá",
        children: [
          {
            title: "Tổng số lượng",
            dataIndex: "budget",
            width: 160,
            align: "right",
            render: (_, rowData) => {
              if (!rowData.isFirstRow) {
                return convertToVND(_);
              }
            },
          },
          {
            title: "Số lượng đã sử dụng",
            dataIndex: "used",
            width: 160,
            align: "right",
            render: (_, rowData) => {
              if (!rowData.isFirstRow) {
                return convertToVND(_);
              }
            },
          },
          {
            title: "Số lượng còn lại",
            dataIndex: "availableBudget",
            width: 160,
            align: "right",
            render: (_, rowData) => {
              if (!rowData.isFirstRow) {
                return convertToVND(_);
              }
            },
          },
          {
            title: "Tổng số tiền đã chiết khấu",
            dataIndex: "availableBudget",
            width: 160,
            align: "right",
            render: (_, rowData) => {
              if (!rowData.isFirstRow) {
                return convertToVND(_);
              }
            },
          },
        ],
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

    let res = await statisApi.getAllPromotions({
      fromDate: filterState.fromDate,
      toDate: filterState.toDate,
    });

    if (res.isSuccess) {
      dispatch(setAllPromotions(res.promotions));
    } else {
      dispatch(setAllPromotions([]));
    }
    setIsLoading(false);
  }

  function handleUpliedFilters() {
    setIsLoading(true);
    if (data) {
      let _list = [...data];

      if (filterState.promotionId) {
        _list = _list.filter((item) => {
          let promotionId = item.promotionId?.toLowerCase();
          let searchInput = filterState.promotionId?.toLowerCase();

          if (promotionId?.includes(searchInput)) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (filterState.name) {
        _list = _list.filter((item) => {
          let name = item.name?.toLowerCase();
          let searchInput = filterState.name?.toLowerCase();

          if (name?.includes(searchInput)) {
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
          <div className="btn__item">
            <Button onClick={clearFilter} type={"primary"} danger>
              Xóa Lọc
            </Button>
          </div>

          <div className="btn__item">
            <ExportExcelButton
              data={dataAfterFilted.map((item) => {
                return {
                  index: item.index,
                  promotionId: item.promotionId,
                  name: item.name,
                  startDate: sqlToDDmmYYY(item.startDate),
                  endDate: sqlToDDmmYYY(item.endDate),
                  giftProductId: item.giftProductId,
                  productName: item.productName,
                  quantityApplied: item.quantityApplied,
                  unitType: item.unitType,
                  discount: item.discount,
                  budget: item.budget,
                  discounted: item.discounted,
                  availableBudget: item.availableBudget,
                };
              })}
              nameTemplate={"StatisPromotions"}
              headerNameList={allColumns}
              fromDate={filterState.fromDate}
              toDate={filterState.toDate}
              employeeName={account.name}
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
        bordered
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

export default StatisPromotions;
