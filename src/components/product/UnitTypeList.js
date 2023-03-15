import React, { useState } from "react";
import { Input, InputNumber, Switch, Tag, Typography } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

const { Text } = Typography;

const UnitTypeList = ({ unitList, setUnitList, errList, setErrList }) => {
  function onChangUnitItem(index, feild, value) {
    let _unitList = [...unitList];
    _unitList[index][feild] = value;
    setUnitList(_unitList);
  }

  return (
    <div className="unittype_list">
      <Typography.Title level={5}>Các đơn vị tính</Typography.Title>
      <div className="unittype_container">
        <Text className="unittype_label id">Mã đvt</Text>
        <Text className="unittype_label name">Tên </Text>
        <Text className="unittype_label convertion">Đơn vị quy đổi </Text>
        <Text className="unittype_state state">Trạng thái</Text>
      </div>
      {unitList &&
        unitList.map((unit, index) => {
          return (
            <div className="unittype_container">
              <div className="unittype_wrap id">
                <Input
                  className="input"
                  placeholder="LON24"
                  size="small"
                  style={{
                    marginRight: "24px",
                  }}
                  value={unitList[index].id}
                  onChange={({ target }) => {
                    onChangUnitItem(index, "id", target.value);
                  }}
                />
                <div className="unittype_error"></div>
              </div>
              <div className="unittype_wrap name">
                <Input
                  className="input"
                  placeholder="Thùng 24 lon"
                  size="small"
                  style={{
                    marginRight: "24px",
                  }}
                  value={unitList[index].name}
                  onChange={({ target }) => {
                    onChangUnitItem(index, "name", target.value);
                  }}
                  status={errList[index].name && "error"}
                />
                <div className="unittype_error">{errList[index].name}</div>
              </div>
              <div className="unittype_wrap convertion">
                <InputNumber
                  className="input"
                  min={1}
                  size="small"
                  value={unitList[index].convertion}
                  onChange={(value) => {
                    onChangUnitItem(index, "convertion", value);
                  }}
                  status={errList[index].convertion && "error"}
                />
                <div className="unittype_error">
                  {errList[index].convertion}
                </div>
              </div>
              <Switch
                className="switch"
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={unitList[index].state}
                onChange={(is) => onChangUnitItem(index, "state", is)}
              />
              <div className="icon_delete">
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={index == 0}
                  onClick={() => {
                    let _unitList = unitList.filter((_, ind) => ind != index);
                    let _errList = errList.filter((_, ind) => ind != index);
                    setErrList(_errList);
                    setUnitList(_unitList);
                  }}
                />
              </div>
              {index == 0 && (
                <div
                  className="base_unit"
                  style={{
                    marginLeft: "12px",
                  }}
                >
                  <Tag color="gold">Đơn vị cở bản</Tag>
                </div>
              )}
            </div>
          );
        })}

      <Button
        size="small"
        icon={<PlusOutlined />}
        onClick={() => {
          let _unitList = [...unitList];
          _unitList.push({
            id: "",
            name: "",
            convertion: 1,
            state: true,
          });

          let _errList = [...errList];
          _errList.push({
            name: "",
            convertion: "",
          });
          setErrList(_errList);
          setUnitList(_unitList);
        }}
      >
        Thêm mới
      </Button>
    </div>
  );
};

export default UnitTypeList;
