import React, { useEffect, useState } from "react";
import { message, Switch, Table, Typography } from "antd";
import { Button } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import DropSelectColum from "../product/DropSelectColum";
import PromotionLineModal from "./PromotionLineModal";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import promotionApi from "./../../api/promotionApi";
import {
  setPromotionLines,
  setRefreshPromotionLines,
} from "../../store/slices/promotionLineSlice";
import { compareDMY, sqlToDDmmYYY } from "./../../utils/index";
import { setOpen } from "../../store/slices/modalSlice";

const PromotionLineTable = ({
  promotionHeaderId,
  headerState,
  isDisabledAddButton,
}) => {
  let hideLoading = null;
  const { promotionLines, refresh, count } = useSelector(
    (state) => state.promotionLine
  );

  const dispatch = useDispatch();

  const [allColumns, setAllColumns] = useState([]);

  useEffect(() => {
    setAllColumns([
      {
        title: "Mã KM",
        dataIndex: "id",

        width: 160,
        fixedShow: true,
        render: (id, rowData) => {
          if (rowData.type == "V") {
            return rowData.groupVoucher;
          } else {
            return id;
          }
        },
      },
      {
        title: "Tên KM",
        dataIndex: "title",
        width: 200,
      },
      {
        title: "Loại KM",
        dataIndex: "",
        width: 200,
        render: (_, rowData) => {
          if (rowData && rowData.type == "PP") {
            return "Tặng sản phẩm";
          }
          if (rowData && rowData.type == "V") {
            return "Phiếu giảm giá";
          }
          if (rowData && rowData.type == "MP") {
            return "Chiếu khấu theo hóa đơn";
          }
          if (rowData && rowData.type == "DRP") {
            return "Chiết khấu trên sản phẩm";
          }
        },
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        hidden: true,
        width: 200,
      },
      {
        title: "Ngày bắt đầu",
        dataIndex: "startDate",
        render: (_, rowData) => {
          if (rowData) {
            return sqlToDDmmYYY(rowData.startDate);
          }
        },
      },

      {
        title: "Ngày kết thúc",
        dataIndex: "endDate",
        render: (_, rowData) => {
          if (rowData) {
            return sqlToDDmmYYY(rowData.endDate);
          }
        },
      },
      {
        title: "Tình trạng áp dụng",
        dataIndex: "state",
        render: (_, rowData) => {
          if (rowData) {
            let start = new Date(rowData.startDate);
            let end = new Date(rowData.endDate);
            let now = new Date();
            let state = rowData.state;

            if (compareDMY(end, now) < 0) {
              return <div style={{ color: "red" }}>Đã hết hạn</div>;
            }
            if (compareDMY(start, now) > 0) {
              return <div style={{ color: "gold" }}>Sắp tới</div>;
            }

            if (compareDMY(start, now) <= 0 && compareDMY(end, now) >= 0) {
              if (state && headerState) {
                return <div style={{ color: "green" }}>Đang áp dụng</div>;
              } else {
                return <div style={{ color: "purple" }}>Tạm ngưng</div>;
              }
            }
          }
        },
      },

      {
        title: "Trạng thái",
        dataIndex: "state",
        render: (state, rowData) => {
          return (
            <Switch
              checkedChildren="On"
              unCheckedChildren="Off"
              checked={state}
              disabled={disableChangeLineState(rowData)}
              onChange={(is) => {
                handleChangeLineState(is, rowData);
              }}
            />
          );
        },
      },
      {
        title: "Hành động",
        dataIndex: "id",
        width: 80,
        fixed: "right",
        fixedShow: true,
        render: (_, row) => (
          <>
            <Button
              size="small"
              icon={
                <EditOutlined
                  onClick={() => {
                    onClickRowId(row);
                  }}
                />
              }
            />
            <Button
              style={{
                marginLeft: 8,
              }}
              danger
              disabled={disabledItem("btnDelete", row)}
              size="small"
              icon={
                <DeleteOutlined
                  onClick={() => {
                    onRemoveLine(row);
                  }}
                />
              }
            />
          </>
        ),
      },
    ]);

    return () => {};
  }, [headerState, promotionHeaderId]);

  useEffect(() => {
    if (promotionHeaderId) {
      getAllPromotionLines(promotionHeaderId);
    }
    return () => {};
  }, [promotionHeaderId]);

  useEffect(() => {
    if (refresh) {
      getAllPromotionLines(promotionHeaderId);
    }
    return () => {};
  }, [refresh]);

  useEffect(() => {
    return () => {
      if (hideLoading) {
        hideLoading();
      }
    };
  }, []);

  async function getAllPromotionLines(promotionHeaderId) {
    hideLoading = message.loading("Tải dữ liệu khuyến mãi...", 0);
    let res = await promotionApi.getOneHeaderById(promotionHeaderId);

    if (res.isSuccess) {
      let _listLines = [];

      res.promotion.ProductPromotions.map((item) => {
        _listLines.push({
          ...item,
          type: "PP",
        });
      });

      res.promotion.DiscountRateProducts.map((item) => {
        _listLines.push({
          ...item,
          type: "DRP",
        });
      });

      res.promotion.MoneyPromotions.map((item) => {
        _listLines.push({
          ...item,
          type: "MP",
        });
      });

      let _voucherList = [];
      res.promotion.Vouchers.map((item) => {
        let isExited = false;

        _voucherList.map((voucher) => {
          if (voucher.groupVoucher == item.groupVoucher) {
            isExited = true;
          }
        });

        if (!isExited) {
          _voucherList.push(item);

          _listLines.push({
            ...item,
            type: "V",
          });
        }
      });

      dispatch(setPromotionLines(_listLines));
    }

    hideLoading();
  }

  function onClickRowId(rowData) {
    dispatch(
      setOpen({
        name: "PromotionLineModal",
        modalState: {
          type: "update",
          visible: true,
          idSelected: rowData.id,
          promotionHeaderId,
        },
      })
    );
  }

  function disableChangeLineState(rowData) {
    let start = new Date(rowData.startDate);
    let end = new Date(rowData.endDate);
    let now = new Date();

    // đã hết hạn
    if (compareDMY(end, now) < 0) {
      return true;
    }
    return false;
  }

  async function onRemoveLine(rowData) {
    let lineId = rowData.id;
    let promotionTypeId = rowData.type;

    let res = {};

    if (promotionTypeId == "PP") {
      res = await promotionApi.deleteOnePP(lineId);
    }
    if (promotionTypeId == "MP") {
      res = await promotionApi.deleteOneMP(lineId);
    }
    if (promotionTypeId == "DRP") {
      res = await promotionApi.deleteOneDRP(lineId);
    }
    if (promotionTypeId == "V") {
      res = await promotionApi.deleteOneV(lineId);
    }

    if (res.isSuccess) {
      message.info("Cập nhật thành công");
      dispatch(setRefreshPromotionLines());
    } else {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  }

  async function handleChangeLineState(is, rowData) {
    let lineId = rowData.id;
    let promotionTypeId = rowData.type;
    let formData = {
      state: is,
    };
    let res = {};

    if (promotionTypeId == "PP") {
      res = await promotionApi.updateOnePP(lineId, formData);
    }
    if (promotionTypeId == "MP") {
      res = await promotionApi.updateOneMP(lineId, formData);
    }
    if (promotionTypeId == "DRP") {
      res = await promotionApi.updateOneDRP(lineId, formData);
    }
    if (promotionTypeId == "V") {
      res = await promotionApi.updateOneV(lineId, formData);
    }

    if (res.isSuccess) {
      message.info("Cập nhật thành công");
      dispatch(setRefreshPromotionLines());
    } else {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  }

  function disabledItem(name, rowData) {
    let start = new Date(rowData.startDate);
    let end = new Date(rowData.endDate);
    let now = new Date();
    let state = rowData.state;

    // da het han
    if (compareDMY(end, now) < 0) {
      return true;
    }

    // tuong lai
    if (compareDMY(start, end) > 0) {
      return false;
    }

    // dang su dung
    if (compareDMY(start, now) <= 0) {
      if (name == "btnDelete") return true;
    }

    if (headerState) {
      return true;
    } else {
    }
  }

  return (
    <div className="promotion_header_form_bottom">
      <div className="table__header">
        <div className="left">
          <Typography.Title level={5} style={{}}>
            Danh sách dòng khuyến mãi{" "}
          </Typography.Title>
        </div>

        <div className="btn__item">
          <Button
            type="dashed"
            size="small"
            icon={<PlusOutlined />}
            style={{
              marginRight: "12px",
            }}
            disabled={isDisabledAddButton}
            onClick={() => {
              dispatch(
                setOpen({
                  name: "PromotionLineModal",
                  modalState: {
                    type: "create",
                    visible: true,
                    promotionHeaderId,
                  },
                })
              );
            }}
          >
            Thêm mới một dòng
          </Button>
          <DropSelectColum
            allColumns={allColumns}
            setAllColumns={setAllColumns}
          />
        </div>
      </div>
      <Table
        columns={allColumns.filter((col) => !col.hidden)}
        dataSource={promotionLines}
        pagination={false}
        size="small"
        scroll={{
          x: allColumns.filter((item) => !item.hidden).length * 150,
          y: window.innerHeight * 0.5,
        }}
        className="table"
      />
    </div>
  );
};

export default PromotionLineTable;
