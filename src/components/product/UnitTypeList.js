import React, { useState } from "react";
import { Input, InputNumber, Select, Switch, Tag, Typography } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import UnitTypeSelect from "./UnitTypeSelect";
import unitTypeApi from "./../../api/unitTypeApi";

const { Text } = Typography;

const UnitTypeList = ({
  unitList,
  setUnitList,
  errList,
  setErrList,
  typeOfModal,
}) => {
  const handleChange = async (index, value) => {
    let res = await unitTypeApi.getOneById(value);

    if (res.isSuccess) {
      let _unitList = [...unitList];
      _unitList[index] = res.unitType;
      setUnitList(_unitList);
    }
  };

  return (
    <div className="unittype_list">
      <Typography.Title level={5}>Các đơn vị tính</Typography.Title>
      <div className="unittype_container">
        {/* <Text className="unittype_label id">Mã đvt</Text> */}
        <Text className="unittype_label name">Tên </Text>
        <Text className="unittype_label convertion">Đơn vị quy đổi </Text>
        {/* <Text className="unittype_state state">Trạng thái</Text> */}
      </div>
      {unitList &&
        unitList.map((unit, index) => {
          return (
            <div className="unittype_container">
              <div className="unittype_wrap name">
                <UnitTypeSelect
                  handleChange={(value) => {
                    handleChange(index, value);
                  }}
                  value={unit.id}
                  type={index == 0 && "base"}
                  listIdUTSelected={unitList.map((item) => {
                    return item?.id;
                  })}
                  disabled={unit.isExistOnDB}
                />

                <div className="unittype_error">{errList[index]?.name}</div>
              </div>
              <div className="unittype_wrap convertion">
                <InputNumber
                  className="input"
                  disabled
                  value={unit?.convertionQuantity}
                />
                <div className="unittype_error">
                  {errList[index]?.convertionQuantity}
                </div>
              </div>
              {/* <Switch
                className="switch"
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={unitList[index].state}
              /> */}
              <div className="icon_delete">
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  disabled={index == 0 || unit.isExistOnDB}
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
            convertionQuantity: "",
            state: true,
          });

          let _errList = [...errList];
          _errList.push({
            name: "",
            convertionQuantity: "",
          });
          setErrList(_errList);
          setUnitList(_unitList);
        }}
        disabled={typeOfModal == "view"}
      >
        Thêm mới
      </Button>
    </div>
  );
};

export default UnitTypeList;
