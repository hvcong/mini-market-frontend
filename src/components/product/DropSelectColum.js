import { CaretDownOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";

const DropSelectColum = ({ allColumns, setAllColumns }) => {
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [columns, setColumns] = useState({});

  return (
    <div className="downdown__select-column">
      <div onClick={() => setIsShowDropdown(!isShowDropdown)}>
        <Button size="small" type="primary" icon={<MenuUnfoldOutlined />}>
          <CaretDownOutlined />
        </Button>
      </div>
      <div
        className="body"
        style={{
          display: isShowDropdown ? "flex" : "none",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Typography.Title level={5}>Các cột sẽ hiển thị</Typography.Title>
          </Col>
          {allColumns &&
            allColumns.map((col) => {
              return (
                <Col span={12}>
                  <Checkbox
                    checked={!col.hidden}
                    disabled={col.fixedShow}
                    onChange={() => {
                      let allCols = [...allColumns];

                      allCols = allCols.map((item) => {
                        if (item.title == col.title) {
                          item.hidden = !col.hidden;
                        }
                        return item;
                      });
                      setAllColumns(allCols);
                    }}
                  >
                    {col.title}
                  </Checkbox>
                </Col>
              );
            })}
        </Row>
      </div>
    </div>
  );
};

export default DropSelectColum;
