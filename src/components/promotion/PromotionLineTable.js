import React, { useEffect, useState } from "react";
import { message, Table, Typography } from "antd";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DropSelectColum from "../product/DropSelectColum";
import PromotionLineModal from "./PromotionLineModal";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import promotionApi from "./../../api/promotionApi";
import { setPromotionLines } from "../../store/slices/promotionLineSlice";
import { sqlToDDmmYYY } from "./../../utils/index";
import { setOpen } from "../../store/slices/modalSlice";

const PromotionLineTable = ({ promotionHeaderId, headerState }) => {
  let hideLoading = null;
  const { promotionLines, refresh, count } = useSelector(
    (state) => state.promotionLine
  );

  const dispatch = useDispatch();

  const [minMaxTime, setMinMaxTime] = useState({
    minStartDate: "",
    maxEndDate: "",
  });

  const [allColumns, setAllColumns] = useState([]);

  useEffect(() => {
    setAllColumns([
      {
        title: "Mã KM",
        dataIndex: "id",
        width: 160,
        fixed: "left",
        fixedShow: true,
        render: (_, row) => (
          <Typography.Link onClick={() => onClickRowId(row)}>
            {row.id}
          </Typography.Link>
        ),
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
        title: "Trạng thái",
        dataIndex: "state",
        render: (_, rowData) => {
          if (rowData) {
            if (!headerState) {
              return <div style={{ color: "red" }}>Đã ngưng</div>;
            } else {
              return rowData.state ? (
                <div style={{ color: "green" }}>Đang hoạt động</div>
              ) : (
                <div style={{ color: "red" }}>Đã ngưng</div>
              );
            }
          }
        },
      },
    ]);

    return () => {};
  }, [headerState]);

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
      setMinMaxTime({
        minStartDate: res.promotion.startDate,
        maxEndDate: res.promotion.endDate,
      });

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

      res.promotion.Vouchers.map((item) => {
        _listLines.push({
          ...item,
          type: "V",
        });
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
          minMaxTime,
        },
      })
    );
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
            onClick={() => {
              dispatch(
                setOpen({
                  name: "PromotionLineModal",
                  modalState: {
                    type: "create",
                    visible: true,
                    promotionHeaderId,
                    minMaxTime,
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
