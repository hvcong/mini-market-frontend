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
    fromDate: new Date("2023/04/01"),
    toDate: new Date(),
    customerId: "",
    typeCustomer: "",
    ward: "",
    district: "",
    city: "",
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
        title: "Mã KH",
        dataIndex: "customerId",
        width: 160,
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.customerId}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    customerId: target.value,
                  });
                }}
              />
            );
          }

          return (
            <HighlightedText text={_} highlightText={filterState.customerId} />
          );
        },
      },
      {
        title: "Tên KH",
        dataIndex: "customerName",
        width: 160,
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.customerName}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    customerName: target.value,
                  });
                }}
              />
            );
          }

          return (
            <HighlightedText
              text={_}
              highlightText={filterState.customerName}
            />
          );
        },
      },

      {
        title: "Địa chỉ",
        dataIndex: "address",
        width: 60,
      },
      {
        title: "Phường/Xã",
        dataIndex: "ward",
        width: 160,
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.ward}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    ward: target.value,
                  });
                }}
              />
            );
          }

          return <HighlightedText text={_} highlightText={filterState.ward} />;
        },
      },
      {
        title: "Quận/Huyện",
        dataIndex: "district",
        width: 120,
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.district}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    district: target.value,
                  });
                }}
              />
            );
          }

          return (
            <HighlightedText text={_} highlightText={filterState.district} />
          );
        },
      },
      {
        title: "Tỉnh/Thành",
        dataIndex: "city",
        width: 160,
        render: (_, rowData) => {
          if (rowData.isFirstRow) {
            return (
              <Input
                placeholder="Tìm kiếm"
                value={filterState.city}
                allowClear
                onChange={({ target }) => {
                  setFilterState({
                    ...filterState,
                    city: target.value,
                  });
                }}
              />
            );
          }

          return <HighlightedText text={_} highlightText={filterState.city} />;
        },
      },
      {
        title: "Nhóm Khách Hàng",
        dataIndex: "typeCustomer",
        width: 160,
        // render: (_, rowData) => {
        //   if (rowData.isFirstRow) {
        //     return (
        //       <Input
        //         placeholder="Tìm kiếm"
        //         value={filterState.typeCustomer}
        //         allowClear
        //         onChange={({ target }) => {
        //           setFilterState({
        //             ...filterState,
        //             typeCustomer: target.value,
        //           });
        //         }}
        //       />
        //     );
        //   }

        //   return (
        //     <HighlightedText
        //       text={_}
        //       highlightText={filterState.typeCustomer}
        //     />
        //   );
        // },
      },
      {
        title: "Nhóm SP (c1)",
        dataIndex: "category",
        width: 160,
      },
      {
        title: "Nhóm SP (c2)",
        dataIndex: "subCategory",
        width: 160,
      },

      {
        title: "Doanh số trước CK",
        dataIndex: "beforeDiscount",
        width: 120,
        align: "right",
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return convertToVND(_);
          }
        },
      },
      {
        title: "Chiết khấu",
        dataIndex: "discount",
        width: 120,
        align: "right",
        render: (_, rowData) => {
          if (!rowData.isFirstRow) {
            return convertToVND(_);
          }
        },
      },
      {
        title: "Doanh số sau CK",
        dataIndex: "cost",
        width: 120,
        align: "right",
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

    let res = await statisApi.getAllByCustomer({
      fromDate: filterState.fromDate,
      toDate: filterState.toDate,
    });

    if (res.isSuccess) {
      let dataBills = res.bills || [];

      dispatch(setAllBillsCustomers(sortData(dataBills, "customerId")));
    } else {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
    setIsLoading(false);
  }

  function handleUpliedFilters() {
    setIsLoading(true);
    if (data) {
      let _list = [...data];

      let [fromDate, toDate, ...filterNames] = Object.keys(filterState);
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
            let category = "";
            let subCategory = "";

            (item.categories || []).map((cate) => {
              if (category) {
                category += ", ";
              }
              category += cate;
            });

            (item.subCategories || []).map((subItem) => {
              if (subCategory) {
                subCategory += ", ";
              }
              subCategory += subItem;
            });

            return {
              ...item,
              index: index + 1,
              category,
              subCategory,
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
                  category: item.category,
                  subCategory: item.subCategory,
                  beforeDiscount: item.beforeDiscount,
                  discount: item.discount,
                  cost: item.cost,
                };
              })}
              nameTemplate={"StatisBillsCustomers"}
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
