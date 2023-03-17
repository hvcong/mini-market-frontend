import React, { useEffect, useRef, useState } from "react";

import {
  Modal,
  Button,
  Cascader,
  DatePicker,
  Form,
  Radio,
  Select,
  Switch,
  TreeSelect,
  Input,
  Row,
  Col,
  Typography,
  Space,
  InputNumber,
  Divider,
  Table,
  message,
} from "antd";
import ModalCustomer from "../ModalCustomer";
import {
  CloseOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import SelectCategory from "../product/SelectCategory";
import SelectSubCategory from "../product/SelectSubCategory";
import DropSelectColum from "../product/DropSelectColum";
import SearchProductInput from "./SearchProductInput";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import priceLineApi from "./../../api/priceLineApi";
import {
  removeAllPriceLines,
  removePriceLineByProductId,
  setPriceLines,
  updateOnePriceLine,
} from "../../store/slices/priceLineSlice";
import dayjs, { isDayjs } from "dayjs";
import {
  antdToDmy,
  dmyToAntd,
  dmyToYmd,
  sqlToDDmmYYY,
} from "./../../utils/index";
import ExpandRowRender from "./ExpandRowRender";
import productApi from "./../../api/productApi";
import priceHeaderApi from "../../api/priceHeaderApi";
import { setRefreshPriceHeaders } from "../../store/slices/priceHeaderSlice";
const { Text } = Typography;

const initFormState = {
  id: "",
  title: "",
  time: {
    start: "",
    end: "",
  },
  state: true,
};

const initErrMessage = {
  id: "",
  title: "",
  time: "",
};

const initDataTable = [
  // {
  //   key: "", // productId
  //   productName:"",
  //   items: [
  //     // priceLine
  //   ],
  // },
];

const ddMMyyyy = "DD/MM/YYYY";

const PriceCUModal = ({ modalState, setModalState }) => {
  const { priceLines, sum } = useSelector((state) => state.priceLine);
  const dispatch = useDispatch();
  let hideLoading = null;

  const [formState, setFormState] = useState(initFormState);
  const [errMessage, setErrMessage] = useState(initErrMessage);
  const [allColumns, setAllColumns] = useState([]);
  const [dataTable, setDataTable] = useState(initDataTable);

  // open modal
  useEffect(() => {
    // load priceLines when modal for update
    if (modalState.rowSelected) getPriceLines(modalState.rowSelected.id);

    //set header infor for formState
    if (modalState.rowSelected && modalState.type == "update") {
      let { id, title, startDate, endDate, state } = modalState.rowSelected;
      setFormState({
        ...formState,
        id,
        title,
        time: {
          start: sqlToDDmmYYY(startDate),
          end: sqlToDDmmYYY(endDate),
        },
        state,
      });
    }

    // set columns
    let _columns = [
      {
        title: modalState.type == "create" ? <CloseSquareOutlined /> : "",
        width: 42,
        fixed: "left",
        fixedShow: true,
        render: (_, row) => (
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            disabled={!row.isCanDelete}
            onClick={() => {
              message.info("delete");
              dispatch(removePriceLineByProductId(row.key));
            }}
          />
        ),
      },
      {
        title: "Mã SP",
        width: 100,
        fixed: "left",
        dataIndex: "key",
        // hidden: true,
      },
      {
        title: "Tên SP",
        dataIndex: "productName",
        width: 200,
        fixed: "left",
        fixedShow: true,
      },
      {
        title: "Giá nhập",
        dataIndex: "priceIn",
        fixedShow: true,
      },
    ];
    setAllColumns(_columns);

    return () => {};
  }, [modalState]);

  useEffect(() => {
    if (modalState.type == "create") {
      let _priceLines = priceLines.map((item) => {
        return {
          ...item,
          startDate: formState.time.start,
          endDate: formState.time.end,
        };
      });

      dispatch(setPriceLines(_priceLines));
    }

    return () => {};
  }, [formState.time]);

  async function getPriceLines(headerId) {
    let res = null;
    res = await priceLineApi.getByHeaderId(headerId);

    if (res.isSuccess) {
      let listPrices = res.listPrices;
      let _newList = listPrices.map((item) => {
        return {
          ...item,
          isExistInDB: true,
          isChecked: true,
        };
      });

      for (const priceLine of listPrices) {
        let product = priceLine.ProductUnitType.Product || {};
        let productUnitTypes = product.ProductUnitTypes || [];

        //lặp qua từng putId kiểm tra xem đã tồn tại trong listPrices chưa, nếu chưa có thì thêm
        productUnitTypes.map((put) => {
          let isExist = false;

          for (const item of listPrices) {
            if (put.id == item.ProductUnitType.id) {
              isExist = true;
              break;
            }
          }

          // thêm mới một priceline
          if (!isExist) {
            let _newPriceLine = {
              startDate: "",
              endDate: "",
              price: 0,
              state: false,
              DiscountRateProductId: null,
              ProductUnitTypeId: put.id,

              ProductUnitType: {
                ...put,
                Product: product,
              },
            };

            _newList.push(_newPriceLine);
          }
        });
      }

      console.log(_newList);
      dispatch(setPriceLines(_newList));
    }
  }

  function onCloseModal() {
    clearModal();
    setModalState({
      visible: false,
      type: "",
    });
  }

  function clearModal() {
    setFormState(initFormState);
    setErrMessage(initErrMessage);
    dispatch(removeAllPriceLines());
  }

  // expand when click row
  function expandedRowRender(rowData) {
    return (
      <ExpandRowRender
        rowData={rowData}
        updateRowState={updateRowState}
        formState={formState}
      />
    );
  }
  //
  function disableDateForHeader(current) {}

  useEffect(() => {
    const _dataTable = [];
    priceLines.forEach((priceLine) => {
      let productId = priceLine.ProductUnitType.Product.id;
      let productName = priceLine.ProductUnitType.Product.name;

      if (_dataTable.length > 0) {
        let isPushed = false;
        for (const row of _dataTable) {
          if (productId == row.key) {
            row.items.push(priceLine);

            isPushed = true;
            break;
          }
        }
        // if not exist, push new row
        if (!isPushed) {
          _dataTable.push({
            key: productId,
            productName,
            items: [priceLine],
          });
        }
      } else {
        // if not exist, push new row
        _dataTable.push({
          key: productId,
          productName,
          items: [priceLine],
        });
      }
    });

    for (const row of _dataTable) {
      let { items } = row;
      let isCanDelete = true;

      for (const item of items) {
        if (item.isExistInDB) {
          isCanDelete = false;
          break;
        }
      }
      row.isCanDelete = isCanDelete;
    }
    setDataTable(_dataTable);
    return () => {};
  }, [priceLines]);

  //onChange state a priceline
  function updateRowState(newRow) {
    if (newRow) {
      let _dataTable = dataTable.map((item) => {
        if (item.key == newRow.key) {
          return {
            ...newRow,
          };
        }
        return item;
      });
      setDataTable(_dataTable);
    }
  }

  // on submit create/update header
  async function onSubmit(type, isClose) {
    let _formData = {
      id: "",
      title: "",
      startDate: "",
      endDate: "",
      state: true,
      priceLines: [],
    };

    if (await isCheckData()) {
      hideLoading = message.loading("Đang tạo mới ...", 0);

      let res = {};

      if (type == "create") {
        res = await priceHeaderApi.addOne(_formData);
      } else {
        res = await priceHeaderApi.updateOne(_formData);
      }
      hideLoading();
      if (res.isSuccess) {
        dispatch(setRefreshPriceHeaders());
        if (type == "create") {
          message.info("Thêm mới thành công");
        } else {
          message.info("Cập nhật thành công");
          setModalState({
            visible: false,
          });
        }

        if (isClose) {
          setModalState({
            visible: false,
          });
        }
        clearModal();
      } else {
        message.info("Thêm mới không thành công!");
      }
    } else {
      message.error("Thông tin điền vào không hợp lệ!");
    }

    async function isCheckData() {
      let _errMess = {};
      let isCheck = true;
      if (!formState.id) {
        _errMess.id = "Không được bỏ trống!";
        isCheck = false;
      } else {
        // check is exist in db
      }

      if (!formState.title) {
        _errMess.title = "Không được bỏ trống!";
        isCheck = false;
      } else {
        // check is exist in db
      }

      if (!formState.time.start || !formState.time.end) {
        _errMess.time = "Không được bỏ trống!";
        isCheck = false;
      }

      setErrMessage(_errMess);
      if (!isCheck) {
        return isCheck;
      }

      _formData.id = formState.id;
      _formData.title = formState.title;
      _formData.startDate = dmyToYmd(formState.time.start);
      _formData.endDate = dmyToYmd(formState.time.end);
      _formData.state = formState.state;

      dataTable.map((row) => {
        row.items.map((item) => {
          if (item.isChecked) {
            _formData.priceLines.push({
              startDate: dmyToYmd(item.startDate),
              endDate: dmyToYmd(item.endDate),
              price: item.price,
              state: item.state,
              productUnitTypeId: item.ProductUnitTypeId,
            });
          }
        });
      });

      return true;
    }
  }

  // close hideloading
  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, []);

  return (
    <div className="price__modal">
      <ModalCustomer visible={modalState.visible}>
        <div>
          <div className="title__container">
            <Typography.Title level={4} className="title">
              {modalState.type == "update"
                ? "Cập nhật thông tin bảng giá"
                : "Thêm mới bảng giá"}
            </Typography.Title>
          </div>
          <div className="form__container">
            <div className="infor__input">
              <div className="input__container">
                <Text className="input__label">Mã</Text>
                <div className="input_wrap">
                  <Input
                    placeholder="Mã"
                    size="small"
                    style={{
                      width: "150px",
                    }}
                    value={formState.id}
                    onChange={({ target }) =>
                      setFormState({ ...formState, id: target.value })
                    }
                    status={errMessage.id && "error"}
                    disabled={modalState.type == "update"}
                  />
                  <div className="input_err">{errMessage.id}</div>
                </div>
              </div>
              <div className="input__container">
                <Text className="input__label">Tên</Text>
                <div className="input_wrap">
                  <Input
                    placeholder="Tên"
                    size="small"
                    style={{
                      width: "300px",
                    }}
                    value={formState.title}
                    onChange={({ target }) =>
                      setFormState({ ...formState, title: target.value })
                    }
                    status={errMessage.title && "error"}
                  />
                  <div className="input_err">{errMessage.title}</div>
                </div>
              </div>
              <div className="input__container">
                <Text className="input__label">Thời gian</Text>
                <div className="input_wrap">
                  <DatePicker.RangePicker
                    size="small"
                    format={ddMMyyyy}
                    value={[
                      dmyToAntd(formState.time.start),
                      dmyToAntd(formState.time.end),
                    ]}
                    onChange={(value) => {
                      if (value) {
                        setFormState({
                          ...formState,
                          time: {
                            start: antdToDmy(value[0]),
                            end: antdToDmy(value[1]),
                          },
                        });
                      } else {
                        setFormState({
                          ...formState,
                          time: {
                            start: "",
                            end: "",
                          },
                        });
                      }
                    }}
                    disabledDate={disableDateForHeader}
                    status={errMessage.time && "error"}
                  />
                  <div className="input_err">{errMessage.time}</div>
                </div>
              </div>
              <div className="input__container">
                <Text className="input__label">Trạng thái</Text>
                <Switch
                  checkedChildren="On"
                  unCheckedChildren="Off"
                  checked={formState.state}
                  onChange={(is) =>
                    setFormState({
                      ...formState,
                      state: is,
                    })
                  }
                />
              </div>
            </div>

            <div className="table__header">
              <div className="left">
                <Typography.Title
                  level={5}
                  style={{
                    margin: 0,
                  }}
                >
                  Danh sách sản phẩm{" "}
                </Typography.Title>
                <div className="search__container">
                  <SearchProductInput
                    placeholder="Thêm sản phẩm vào bảng giá"
                    style={{
                      width: "280px",
                    }}
                    formState={formState}
                  />
                </div>
              </div>

              <div className="btn__item">
                <DropSelectColum
                  allColumns={allColumns}
                  setAllColumns={setAllColumns}
                />
              </div>
            </div>
            <Table
              columns={allColumns.filter((col) => !col.hidden)}
              dataSource={dataTable}
              pagination={false}
              size="small"
              scroll={{
                x: allColumns.filter((item) => !item.hidden).length * 150,
                y: window.innerHeight * 0.5,
              }}
              className="table"
              expandable={{
                expandedRowRender,
              }}
            />

            <Space
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {modalState.type == "create" ? (
                <>
                  <Button
                    type="primary"
                    onClick={() => {
                      onSubmit("create", false);
                    }}
                  >
                    Lưu & Thêm mới
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => {
                      onSubmit("create", true);
                    }}
                  >
                    Lưu & Đóng
                  </Button>
                </>
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    onSubmit("update");
                  }}
                >
                  Cập nhật
                </Button>
              )}
              <Button type="primary" danger onClick={onCloseModal}>
                Hủy bỏ
              </Button>
            </Space>
          </div>
        </div>
      </ModalCustomer>
    </div>
  );
};

export default PriceCUModal;
