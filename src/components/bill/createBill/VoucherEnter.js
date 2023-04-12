import { Button, Input, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import promotionApi from "../../../api/promotionApi";
import { compareDMY, convertToVND } from "../../../utils";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setVoucherUsed } from "../../../store/slices/createBillSlice";

const VoucherEnter = ({ voucherUsed, customer, discountByVoucher }) => {
  const dispatch = useDispatch();

  const [isShowDetail, setIsShowDetail] = useState(false);
  const [input, setInput] = useState("");
  const [errMess, setErrMess] = useState("");

  useEffect(() => {
    setInput("");
    setErrMess("");
    dispatch(setVoucherUsed(null));
    return () => {};
  }, [customer]);

  async function onSubmit(type) {
    dispatch(setVoucherUsed(null));
    setErrMess("");
    let res = await promotionApi.getOneVByCode(input);
    if (res.isSuccess) {
      let voucher = res.voucher;

      let headerState = voucher.PromotionHeader.state;
      let TypeCustomers = voucher.PromotionHeader.TypeCustomers;
      let start = new Date(voucher.startDate);
      let end = new Date(voucher.endDate);
      let now = new Date();
      let state = voucher.state;
      let PromotionResult = voucher.PromotionResult;
      let isCheck = false;

      for (const type of TypeCustomers) {
        if (type.id == customer.TypeCustomerId) {
          isCheck = true;
          break;
        }
      }

      if (!isCheck) {
        setErrMess("Mã giảm giá này không áp dụng cho khách hàng này!");
      } else if (
        !headerState ||
        !state ||
        compareDMY(start, now) > 0 ||
        compareDMY(end, now) < 0
      ) {
        isCheck = false;
        setErrMess("Phiếu giảm giá đã hết hạn");
      } else if (PromotionResult) {
        isCheck = false;
        setErrMess("Phiếu giảm giá chỉ được sử dụng một lần");
      }

      if (isCheck) {
        message.info("Áp dụng thành công");
        dispatch(setVoucherUsed(voucher));
      }
    } else {
      setErrMess("Mã giảm giá này không tồn tại!");
    }
  }

  function onCancel() {
    setInput("");
    setErrMess("");
    dispatch(setVoucherUsed(null));
  }
  return (
    <div className="bill_infor_voucher">
      <Typography.Title level={5} className="bill_infor_voucher_title">
        Phiếu giảm giá
      </Typography.Title>

      <div className="bill_infor_voucher_group">
        <div className="bill_infor_voucher_input_wrap">
          <Input
            value={input}
            size="small"
            disabled={voucherUsed}
            onChange={({ target }) => {
              let value = target.value;
              if (value) {
                value = value.trim();
              }
              setErrMess("");
              setInput(value);
            }}
            className="bill_infor_voucher_input"
            placeholder="Nhập mã giảm giá"
            status={errMess && "error"}
          />
          <div className="bill_infor_voucher_input_err">{errMess}</div>
        </div>
        {voucherUsed ? (
          <Button
            size="small"
            danger
            className="bill_infor_voucher_btn"
            onClick={() => {
              onCancel();
            }}
          >
            Hủy áp dụng
          </Button>
        ) : (
          <Button
            size="small"
            type="primary"
            className="bill_infor_voucher_btn"
            disabled={!input}
            onClick={() => {
              onSubmit();
            }}
          >
            Áp dụng
          </Button>
        )}
      </div>
      {voucherUsed && (
        <div className="bill_infor_voucher_detail">
          <div className="bill_infor_voucher_detail_item voucher_used">
            <div className="bill_infor_voucher_detail_label">
              Số tiền chiếu khấu được áp dụng:
            </div>
            <div className="bill_infor_voucher_detail_value">
              - {convertToVND(discountByVoucher || 0)}
            </div>
          </div>
          <Typography.Link
            className="bill_infor_voucher_detail_btn_link"
            onClick={() => {
              setIsShowDetail(!isShowDetail);
            }}
          >
            Chi tiết {isShowDetail ? <DownOutlined /> : <UpOutlined />}
          </Typography.Link>
          {isShowDetail && (
            <div className="bill_infor_voucher_detail_wrap">
              <div className="bill_infor_voucher_detail_item">
                <div className="bill_infor_voucher_detail_label">
                  Hình thức chiết khấu:
                </div>
                <div className="bill_infor_voucher_detail_value">
                  {voucherUsed.type == "discountMoney" ? "tiền" : "theo % "}
                </div>
              </div>
              {voucherUsed.type == "discountMoney" ? (
                <>
                  <div className="bill_infor_voucher_detail_item">
                    <div className="bill_infor_voucher_detail_label">
                      Số tiền chiếu khấu
                    </div>
                    <div className="bill_infor_voucher_detail_value">
                      {convertToVND(voucherUsed.discountMoney)}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bill_infor_voucher_detail_item">
                    <div className="bill_infor_voucher_detail_label">
                      % chiết khấu:
                    </div>
                    <div className="bill_infor_voucher_detail_value">
                      {voucherUsed.discountRate}
                    </div>
                  </div>
                  <div className="bill_infor_voucher_detail_item">
                    <div className="bill_infor_voucher_detail_label">
                      Số tiền chiết khấu tối đa:
                    </div>
                    <div className="bill_infor_voucher_detail_value">
                      {convertToVND(voucherUsed.maxDiscountMoney)}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoucherEnter;
