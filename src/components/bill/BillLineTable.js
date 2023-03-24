import React, { useEffect, useState } from "react";
import { message, Table, Typography } from "antd";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DropSelectColum from "../product/DropSelectColum";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import promotionApi from "./../../api/promotionApi";
import { setPromotionLines } from "../../store/slices/promotionLineSlice";
import { sqlToDDmmYYY } from "./../../utils/index";
import PromotionLineModal from "./../promotion/PromotionLineModal";

const BillLineTable = ({ promotionHeaderId }) => {
  let hideLoading = null;
  const { promotionLines, refresh, count } = useSelector(
    (state) => state.promotionLine
  );
  const dispatch = useDispatch();

  const [modalState, setModalState] = useState({});

  const [allColumns, setAllColumns] = useState([
    {
      title: "Mã KM",
      dataIndex: "id",
      width: 120,
      fixed: "left",
      fixedShow: true,
      render: (_, row) => (
        <Typography.Link onClick={onClickRowId}>{row.id}</Typography.Link>
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
          return rowData.state ? (
            <div style={{ color: "green" }}>Đang hoạt động</div>
          ) : (
            <div style={{ color: "red" }}>Đã ngưng</div>
          );
        }
      },
    },
  ]);

  useEffect(() => {
    getAllPromotionLines(promotionHeaderId);
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

      res.promotion.Vouchers.map((item) => {
        _listLines.push({
          ...item,
          type: "V",
        });
      });

      dispatch(setPromotionLines(_listLines));
      console.log(_listLines);
    }

    hideLoading();
  }

  function onClickRowId(rowData) {
    setModalState({
      type: "update",
      visible: true,
      rowSelected: rowData,
    });
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
              setModalState({
                type: "create",
                visible: true,
              });
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
      <PromotionLineModal
        modalState={modalState}
        setModalState={setModalState}
        promotionHeaderId={promotionHeaderId}
      />
    </div>
  );
};

export default BillLineTable;
