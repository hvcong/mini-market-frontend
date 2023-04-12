import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import React, { useState } from "react";
import { convertToVND } from "../../../utils";

const MoneyDiscount = ({ MPused, discountOnBill }) => {
  const [isShowDetail, setIsShowDetail] = useState(false);
  return (
    <div className="bill_infor_money_discount">
      <Typography.Title
        level={5}
        className="bill_infor_money_discount_header_text"
      >
        Giảm giá theo gía trị đơn hàng
      </Typography.Title>

      {MPused && (
        <>
          <div className="bill_infor_money_discount_group">
            <div className="bill_infor_money_discount_label">
              Số tiền chiếu khấu được áp dụng:
            </div>
            <div className="bill_infor_money_discount_value">
              -{convertToVND(discountOnBill || 0)}
            </div>
          </div>
          <Typography.Link
            className="bill_infor_money_discount_btn_link"
            onClick={() => {
              setIsShowDetail(!isShowDetail);
            }}
          >
            Chi tiết khuyến mãi{" "}
            {isShowDetail ? <DownOutlined /> : <UpOutlined />}
          </Typography.Link>
          {isShowDetail && (
            <div className="bill_infor_money_discount_detail">
              <div className="bill_infor_money_discount_detail_item">
                <div className="bill_infor_money_discount_detail_label">
                  Hình thức chiếu khấu
                </div>
                <div className="bill_infor_money_discount_detail_value">
                  {MPused.type == "discountMoney" ? "tiền" : "theo %"}
                </div>
              </div>
              <div className="bill_infor_money_discount_detail_item">
                <div className="bill_infor_money_discount_detail_label">
                  Tổng tiền mua hàng tối thiểu yêu cầu
                </div>
                <div className="bill_infor_money_discount_detail_value">
                  {convertToVND(MPused.minCost)}
                </div>
              </div>
              {MPused.type == "discountMoney" ? (
                <>
                  <div className="bill_infor_money_discount_detail_item">
                    <div className="bill_infor_money_discount_detail_label">
                      Số tiền chiết khấu
                    </div>
                    <div className="bill_infor_money_discount_detail_value">
                      {convertToVND(MPused.discountMoney)}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bill_infor_money_discount_detail_item">
                    <div className="bill_infor_money_discount_detail_label">
                      % chiết khấu
                    </div>
                    <div className="bill_infor_money_discount_detail_value">
                      {MPused.discountRate}
                    </div>
                  </div>
                  <div className="bill_infor_money_discount_detail_item">
                    <div className="bill_infor_money_discount_detail_label">
                      Số tiền chiếu khấu tối đa
                    </div>
                    <div className="bill_infor_money_discount_detail_value">
                      {convertToVND(MPused.maxDiscountMoney)}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MoneyDiscount;
