import React from "react";
import CustomerSelect from "./CustomerSelect";
import { sqlToDDmmYYY, sqlToHHmmDDmmYYYY } from "../../../utils";
import { useSelector } from "react-redux";

const BillInforTop = () => {
  return (
    <div className="bill_infor_top">
      <div className="bill_infor_top_item">
        <div className="bill_infor_top_label">Khách hàng:</div>
        <div className="bill_infor_top_value">
          <CustomerSelect
            style={{
              width: 220,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BillInforTop;
