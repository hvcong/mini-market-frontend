import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, Tag, Typography } from "antd";
import React from "react";
import CustomerSelect from "./CustomerSelect";
import EmployeeSelect from "./EmployeeSelect";

const BillInfor = () => {
  return (
    <div className="bill_infor">
      <div className="row">
        <div className="label selectLabel">Nhân viên</div>
        <div className="employee">
          <div className="select_container">
            <EmployeeSelect />
          </div>
          <div className="time_container">10/1/2023 20:04</div>
        </div>
      </div>
      <div className="row">
        <div className="label selectLabel">Khách hàng</div>
        <div className="customer">
          <div className="select_container">
            <CustomerSelect />
          </div>
          <div className="add_cus_icon">
            <PlusOutlined className="icon" />
          </div>
        </div>
        {/* <div className="price_mode">
            
        </div> */}
      </div>
      <div className="row">
        <div className="label">Tổng tiền hàng</div>
        <div className="quantitty">23</div>
        <div className="value">200.000</div>
      </div>
      <div className="row">
        <div className="label">Giảm giá trên sp</div>
        <div
          className="value"
          style={{
            color: "green",
          }}
        >
          200.000
        </div>
      </div>
      <div className="row">
        <div className="label">Giảm giá trên hóa đơn</div>
        <div
          className="value"
          style={{
            color: "green",
          }}
        >
          200.000
        </div>
      </div>
      <div className="row">
        <div className="label bold">Khách cần trả</div>
        <div className="value">
          <Typography.Title level={3} type="success">
            300.000
          </Typography.Title>
        </div>
      </div>
      <div className="line"></div>
      <div className="row">
        <div
          className="label bold"
          style={{
            flex: 1,
          }}
        >
          Tiền khách thanh toán
        </div>
        <div className="value">
          <InputNumber
            defaultValue={1000}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            // onChange={onChange}
            step={1000}
            min={0}
            style={{
              fontSize: "17px",
              width: "140px",
            }}
          />
        </div>
      </div>

      <div className="row">
        <div className="label">Tiền thừa trả khách</div>
        <div
          className="value"
          style={{
            fontSize: "15px",
          }}
        >
          187,888
        </div>
      </div>
      <div className="btn">
        <Button
          type="primary"
          size="large"
          style={{
            width: "100%",
          }}
        >
          THANH TOÁN (F5)
        </Button>
      </div>
    </div>
  );
};

export default BillInfor;
