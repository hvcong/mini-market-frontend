import { Tag, Typography } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { setOpen } from "../../../store/slices/modalSlice";

const PPPopover = ({ rowData }) => {
  const dispatch = useDispatch();

  let title = "";
  let promotionId = "";
  let message = rowData.message;

  let PPused = rowData.ProductPromotion;
  let MPused = rowData.MPused;
  if (PPused) {
    title = PPused.title;
    promotionId = PPused.id;
  }

  if (MPused) {
    title = MPused.title;
    promotionId = MPused.id;
  }

  return (
    <div className="PP_toltip">
      {rowData.message ? (
        <Tag color="gold">{message}</Tag>
      ) : (
        <Tag color="green">Áp dụng thành công</Tag>
      )}
      <div className="PP_toltip_title">KM: {title}</div>
      <Typography.Link
        className="PP_toltip_link"
        onClick={() => {
          dispatch(
            setOpen({
              name: "PromotionLineModal",
              modalState: {
                visible: true,
                type: "view",
                idSelected: promotionId,
              },
            })
          );
        }}
      >
        Chi tiết khuyến mãi
      </Typography.Link>
    </div>
  );
};

export default PPPopover;
