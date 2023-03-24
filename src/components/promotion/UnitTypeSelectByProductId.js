import { Select } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import unitTypeApi from "./../../api/unitTypeApi";

const UnitTypeSelectByProductId = ({ disabledValues, productId, ...props }) => {
  const [loading, setLoading] = useState(false);
  const [listUTs, setListUTs] = useState([]);

  useEffect(() => {
    if (productId) {
      getAllUTByProductId(productId);
    }
    return () => {};
  }, [productId]);

  async function getAllUTByProductId(productId) {
    setLoading(true);
    let res = await unitTypeApi.findAllByProductId(productId);
    if (res.isSuccess) {
      setListUTs(res.unitTypes);
    }
    setLoading(false);
  }

  return (
    <Select
      disabled={!productId}
      {...props}
      loading={loading}
      options={listUTs.map((ut) => {
        let isDisabled = false;
        (disabledValues || []).map((value) => {
          if (value == ut.id) {
            isDisabled = true;
          }
        });
        return {
          value: ut.id,
          label: ut.name,
          disabled: isDisabled,
        };
      })}
    />
  );
};

export default UnitTypeSelectByProductId;
