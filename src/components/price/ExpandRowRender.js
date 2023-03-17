import React, { useState } from "react";
import { Button, DatePicker, InputNumber, Switch, Tag, Typography } from "antd";
import { Checkbox } from "antd";
import { antdToDmy, dmyToAntd } from "../../utils";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
const ddMMyyyy = "DD/MM/YYYY";

const ExpandRowRender = ({ rowData, updateRowState, formState }) => {
  if (!rowData) {
    console.log("null rowData");
    return null;
  }
  const { items } = rowData;

  function onChangeState(type, value, putId) {
    let _updateField = {};
    if (type == "checkbox") {
      _updateField.isChecked = value;
    } else if (type == "price") {
      if (value > 0) {
        _updateField.price = value;
      }
    } else if (type == "time") {
      _updateField.startDate = antdToDmy(value[0]);
      _updateField.endDate = antdToDmy(value[1]);
    } else if (type == "state") {
      _updateField.state = value;
    }

    let _items = items.map((priceLine) => {
      if (priceLine.ProductUnitTypeId == putId) {
        return {
          ...priceLine,
          ..._updateField,
        };
      }
      return priceLine;
    });
    updateRowState({
      ...rowData,
      items: _items,
    });
  }

  return (
    <div className="expand_price_line">
      <div className="expand_price_line_list">
        <div className="expand_price_line_item">
          <div className="expand_price_line_checkbox"></div>
          <div className="expand_price_line_label">
            <Typography.Title level={5}>Đơn vị tính</Typography.Title>
          </div>
          <div className="expand_price_line_conver">
            <Typography.Title level={5}>Đơn vị quy đổi</Typography.Title>
          </div>
          <div className="expand_price_line_input">
            <Typography.Title level={5}>Giá bán</Typography.Title>
          </div>
          <div className="expand_price_line_date">
            <Typography.Title level={5}>Thời gian áp dụng</Typography.Title>
          </div>
          <div className="expand_price_line_state">
            <Typography.Title level={5}>Trạng thái</Typography.Title>
          </div>
        </div>

        {items &&
          items.map((item) => {
            return (
              <div
                className={`expand_price_line_item ${
                  item.isChecked && "checked"
                }`}
              >
                <div className="expand_price_line_checkbox">
                  {item.isChecked && !item.isExistInDB && (
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined style={{ fontSize: "11px" }} />}
                      onClick={() => {
                        onChangeState(
                          "checkbox",
                          false,
                          item.ProductUnitTypeId
                        );
                      }}
                    />
                  )}

                  {!item.isChecked && !item.isExistInDB && (
                    <Button
                      size="small"
                      icon={<PlusOutlined style={{ fontSize: "11px" }} />}
                      onClick={() => {
                        onChangeState("checkbox", true, item.ProductUnitTypeId);
                      }}
                    />
                  )}
                </div>
                <div className="expand_price_line_label">
                  <Tag color="gold">{item.ProductUnitType.UnitType.name}</Tag>
                </div>
                <div className="expand_price_line_conver">
                  {item.ProductUnitType.UnitType.convertionQuantity}
                </div>
                <div className="expand_price_line_input hide">
                  <InputNumber
                    size="small"
                    style={{
                      width: "100px",
                    }}
                    value={item.price}
                    onChange={(value) => {
                      onChangeState("price", value, item.ProductUnitTypeId);
                    }}
                    min={0}
                    disabled={!item.isChecked}
                  />
                </div>
                <div className="expand_price_line_date hide">
                  <DatePicker.RangePicker
                    size="small"
                    format={ddMMyyyy}
                    value={[dmyToAntd(item.startDate), dmyToAntd(item.endDate)]}
                    onChange={(value) => {
                      onChangeState("time", value, item.ProductUnitTypeId);
                    }}
                    disabledDate={(current) => {
                      // Can not select days before today and today
                      return (
                        current <= dmyToAntd(formState.time.start) ||
                        current >= dmyToAntd(formState.time.end)
                      );
                    }}
                  />
                </div>
                <div className="expand_price_line_state hide">
                  <Switch
                    checkedChildren="On"
                    unCheckedChildren="Off"
                    checked={item.state}
                    onChange={(is) => {
                      onChangeState("state", is, item.ProductUnitTypeId);
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ExpandRowRender;
