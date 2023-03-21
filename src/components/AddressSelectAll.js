import React from "react";
import AddressSelectItem from "./AddressSelectItem";
import { Input } from "antd";

const AddressSelectAll = ({ address, setAddress }) => {
  return (
    <div className="address_select">
      <div className="address_select_title">Địa chỉ</div>
      <div className="address_select_item">
        <div className="address_select_item_label">Tỉnh/Thành phố</div>
        <AddressSelectItem
          style={{ width: 170 }}
          placeholder="--- Tỉnh/Thành phố ---"
          type="city"
          setAddressItem={(value) => {
            setAddress({
              cityId: value,
            });
          }}
          value={address.cityId}
        />
      </div>
      <div className="address_select_item">
        <div className="address_select_item_label">Quận/Huyện</div>
        <AddressSelectItem
          style={{ width: 170 }}
          placeholder="--- Quận/Huyện ---"
          type="district"
          cityId={address.cityId}
          setAddressItem={(value) => {
            setAddress({
              cityId: address.cityId,
              districtId: value,
            });
          }}
          value={address.districtId}
        />
      </div>
      <div className="address_select_item">
        <div className="address_select_item_label">Phường/Xã</div>
        <AddressSelectItem
          style={{ width: 170 }}
          placeholder="--- Phường/Xã ---"
          type="ward"
          districtId={address.districtId}
          cityId={address.cityId}
          setAddressItem={(value) => {
            setAddress({
              cityId: address.cityId,
              districtId: address.districtId,
              wardId: value,
            });
          }}
          value={address.wardId}
        />
      </div>
      <div className="address_select_item">
        <div className="address_select_item_label">Số nhà</div>
        <Input
          style={{ width: 170 }}
          placeholder="vd: 06"
          size="small"
          value={address.home}
          onChange={({ target }) => {
            setAddress({
              ...address,
              home: target.value,
            });
          }}
        />
      </div>
    </div>
  );
};

export default AddressSelectAll;
