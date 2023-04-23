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
  setAllStoreInputs,
} from "../../store/slices/statisticSlice";
import statisApi from "../../api/statisApi";
import DatePickerCustom from "../promotion/DatePickerCustom";
import HighlightedText from "../HighlightedText";

const StatisBillsCustomers = () => {
  const { data, refresh } = useSelector(
    (state) => state.statis.allBillsCustomers
  );

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
        title: "",
        children: [
          {
            title: "STT",
            width: 44,
            dataIndex: "index",
          },
          {
            title: "Nhóm SP (c1)",
            dataIndex: "category",
            width: 160,
            render: (_, rowData) => {
              if (rowData.isFirstRow) {
                return (
                  <Input
                    placeholder="Tìm kiếm"
                    value={filterState.category}
                    allowClear
                    onChange={({ target }) => {
                      setFilterState({
                        ...filterState,
                        category: target.value,
                      });
                    }}
                  />
                );
              }

              return (
                <HighlightedText
                  text={_}
                  highlightText={filterState.category}
                />
              );
            },
          },

          {
            title: "Nhóm SP(c2)",
            dataIndex: "subCategory",
            width: 160,
            render: (_, rowData) => {
              if (rowData.isFirstRow) {
                return (
                  <Input
                    placeholder="Tìm kiếm"
                    value={filterState.subCategory}
                    allowClear
                    onChange={({ target }) => {
                      setFilterState({
                        ...filterState,
                        subCategory: target.value,
                      });
                    }}
                  />
                );
              }

              return (
                <HighlightedText
                  text={_}
                  highlightText={filterState.subCategory}
                />
              );
            },
          },
          {
            title: "Mã SP",
            dataIndex: "productId",
            width: 160,
            render: (_, rowData) => {
              if (rowData.isFirstRow) {
                return (
                  <Input
                    placeholder="Tìm kiếm"
                    value={filterState.productId}
                    allowClear
                    onChange={({ target }) => {
                      setFilterState({
                        ...filterState,
                        productId: target.value,
                      });
                    }}
                  />
                );
              }

              return (
                <HighlightedText
                  text={_}
                  highlightText={filterState.productId}
                />
              );
            },
          },

          {
            title: "Tên SP",
            dataIndex: "productName",
            width: 160,
            render: (_, rowData) => {
              if (rowData.isFirstRow) {
                return (
                  <Input
                    placeholder="Tìm kiếm"
                    value={filterState.productName}
                    allowClear
                    onChange={({ target }) => {
                      setFilterState({
                        ...filterState,
                        productName: target.value,
                      });
                    }}
                  />
                );
              }

              return (
                <HighlightedText
                  text={_}
                  highlightText={filterState.productName}
                />
              );
            },
          },
          {
            title: "ĐVT báo cáo",
            dataIndex: "unitTypeReportId",
            width: 160,
          },
          {
            title: "ĐVT cơ bản",
            dataIndex: "unitTypeBaseId",
            width: 160,
          },
          {
            title: "Giá ĐVT cơ bản",
            dataIndex: "price1",
            width: 160,
          },
        ],
      },
      {
        title: "Tồn kho Trên Báo Cáo",

        children: [
          {
            title: "SL ĐVT báo cáo",
            dataIndex: "unitTypeBC",
            width: 160,
          },
          {
            title: "SL ĐVT cơ bản",
            dataIndex: "unitTypeBC",
            width: 160,
          },
          {
            title: "Doanh số",
            dataIndex: "unitTypeBC",
            width: 160,
          },
        ],
      },

      {
        title: "Hàng đang giữ của giao dịch bán hàng",
        children: [
          {
            title: "SL ĐVT báo cáo",
            dataIndex: "unitTypeBC",
            width: 160,
          },
          {
            title: "SL ĐVT cơ bản",
            dataIndex: "unitTypeBC",
            width: 160,
          },
          {
            title: "Doanh số",
            dataIndex: "unitTypeBC",
            width: 160,
          },
        ],
      },

      // tồn kho có thể bán
      {
        title: "Tồn Kho Có Thể Bán",
        children: [
          {
            title: "SL ĐVT báo cáo",
            dataIndex: "unitTypeBC",
            width: 160,
          },
          {
            title: "SL ĐVT cơ bản",
            dataIndex: "unitTypeBC",
            width: 160,
          },
          {
            title: "Doanh số",
            dataIndex: "unitTypeBC",
            width: 160,
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

    let res = await statisApi.getAllByCustomer({
      fromDate: filterState.fromDate,
      toDate: filterState.toDate,
    });

    if (res.isSuccess) {
      dispatch(setAllBillsCustomers(res.bills));
    } else {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
    setIsLoading(false);
  }

  function handleUpliedFilters() {
    setIsLoading(true);
    if (data) {
      let _list = [...data];

      if (filterState.customerId) {
        _list = _list.filter((item) => {
          let customerId = item.customerId?.toLowerCase();
          let searchInput = filterState.customerId?.toLowerCase();

          if (customerId?.includes(searchInput)) {
            return true;
          } else {
            return false;
          }
        });
      }
      if (filterState.typeCustomer) {
        _list = _list.filter((item) => {
          let typeCustomer = item.typeCustomer?.toLowerCase();
          let searchInput = filterState.typeCustomer?.toLowerCase();

          if (typeCustomer?.includes(searchInput)) {
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
                  customerId: item.customerId,
                  customerName: item.customerName,
                  address: item.address,
                  ward: item.ward,
                  district: item.district,
                  city: item.city,
                  typeCustomer: item.typeCustomer,
                  categories: item.categories,
                  subCategories: item.subCategories,
                  beforeDiscount: item.beforeDiscount,
                  discount: item.discount,
                  cost: item.cost,
                };
              })}
              nameTemplate={"StatisStorage"}
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

export default StatisBillsCustomers;
