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
  setAllStorages,
  setAllStoreInputs,
} from "../../store/slices/statisticSlice";
import statisApi from "../../api/statisApi";
import DatePickerCustom from "../promotion/DatePickerCustom";
import HighlightedText from "../HighlightedText";

const StatisBillsCustomers = () => {
  const { data, refresh } = useSelector((state) => state.statis.allStorages);

  const [dataAfterFilted, setDataAfterFilted] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  let hideLoading = null;

  const [dataTable, setDataTable] = useState([{ isFirstRow: true }]);
  const [allColumns, setAllColumns] = useState([]);

  const [filterState, setFilterState] = useState({
    date: new Date(),
    category: "",
    subCategory: "",
    productId: "",
    productName: "",
  });

  const [pageState, setPageState] = useState({
    page: 1,
    limit: 10,
    total: 20,
  });

  function clearFilter() {
    setFilterState({
      date: new Date(),
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
            dataIndex: "reportUnit",
            width: 160,
          },
          {
            title: "ĐVT cơ bản",
            dataIndex: "baseUnit",
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
            dataIndex: "reportQty",
            width: 100,
            align: "right",
          },
          {
            title: "SL ĐVT cơ bản",
            dataIndex: "reportBaseQty",
            width: 100,
            align: "right",
          },
          {
            title: "Doanh số",
            dataIndex: "unitTypeBC",
            width: 160,
            align: "right",
          },
        ],
      },

      {
        title: "Hàng đang giữ của giao dịch bán hàng",
        children: [
          {
            title: "SL ĐVT báo cáo",
            dataIndex: "holdingReport",
            width: 100,
            align: "right",
          },
          {
            title: "SL ĐVT cơ bản",
            dataIndex: "holdingBase",
            width: 100,
            align: "right",
          },
          {
            title: "Doanh số",
            dataIndex: "unitTypeBC",
            width: 160,
            align: "right",
          },
        ],
      },

      // tồn kho có thể bán
      {
        title: "Tồn Kho Có Thể Bán",
        children: [
          {
            width: 100,
            align: "right",
            title: "SL ĐVT báo cáo",
            dataIndex: "sellAble",
          },
          {
            title: "SL ĐVT cơ bản",
            dataIndex: "baseSellAble",
            width: 100,
            align: "right",
          },
          {
            title: "Doanh số",
            dataIndex: "unitTypeBC",
            width: 160,
            align: "right",
          },
        ],
      },
    ]);

    return () => {};
  }, [filterState]);

  useEffect(() => {
    loadAllData();
    return () => {};
  }, [filterState.date]);

  useEffect(() => {
    handleUpliedFilters();

    return () => {};
  }, [filterState, data]);

  async function loadAllData() {
    setIsLoading(true);

    let res = await statisApi.getAllStorage({
      date: filterState.date,
    });

    if (res.isSuccess) {
      dispatch(setAllStorages(res.transactions));
    } else {
      dispatch(setAllStorages([]));
    }
    setIsLoading(false);
  }

  function handleUpliedFilters() {
    setIsLoading(true);
    if (data) {
      let _list = [...data];

      let [date, ...keys] = Object.keys(filterState);

      (keys || []).map((key) => {
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
            <DatePicker
              value={filterState.date && sqlToAntd(filterState.date)}
              onChange={(_, string) => {
                setFilterState({
                  date: string,
                });
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
                  category: item.category,
                  subCategory: item.subCategory,
                  productId: item.productId,
                  productName: item.productName,
                  reportUnit: item.reportUnit,
                  baseUnit: item.baseUnit,
                  basePrice: 0,
                  reportQty: item.reportQty,
                  reportBaseQty: item.reportBaseQty,
                  sum1: 0,
                  holdingReport: item.holdingReport,
                  holdingBase: item.holdingBase,
                  sum2: 0,
                  sellAble: item.sellAble,
                  baseSellAble: item.baseSellAble,
                  sum3: 0,
                };
              })}
              nameTemplate={"StatisStorage"}
              headerNameList={allColumns}
              date={filterState.date}
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
