import React from "react";
import AddressSelectItem from "./AddressSelectItem";
import { Input } from "antd";

const AddressSelectAll = ({ address, setAddress, errMess, disabled }) => {
  return (
    <div className="address_select">
      <div className="address_select_title">Địa chỉ</div>
      <div className="address_select_item">
        <div className="address_select_item_label">Tỉnh/Thành phố</div>
        <div className="address_select_input_wrap">
          <AddressSelectItem
            style={{ width: 170 }}
            placeholder="--- Tỉnh/Thành phố ---"
            disabledFromParent={disabled}
            type="city"
            setAddressItem={(value) => {
              setAddress({
                cityId: value,
              });
            }}
            value={address.cityId}
            status={errMess.cityId && "error"}
          />
          <div className="address_select_input">{errMess.cityId}</div>
        </div>
      </div>
      <div className="address_select_item">
        <div className="address_select_item_label">Quận/Huyện</div>
        <div className="address_select_input_wrap">
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
            disabledFromParent={disabled}
            value={address.districtId}
            status={errMess.districtId && "error"}
          />
          <div className="address_select_input">{errMess.districtId}</div>
        </div>
      </div>
      <div className="address_select_item">
        <div className="address_select_item_label">Phường/Xã</div>
        <div className="address_select_input_wrap">
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
            disabledFromParent={disabled}
            value={address.wardId}
            status={errMess.wardId && "error"}
          />
          <div className="address_select_input">{errMess.wardId}</div>
        </div>
      </div>
      <div className="address_select_item">
        <div className="address_select_item_label">Số nhà</div>
        <div className="address_select_input_wrap">
          <Input
            style={{ width: 170 }}
            placeholder="vd: 06"
            size="small"
            value={address.homeAddress}
            onChange={({ target }) => {
              setAddress({
                ...address,
                homeAddress: target.value,
              });
            }}
            disabled={disabled}
            status={errMess.homeAddress && "error"}
          />
          <div className="address_select_input">{errMess.homeAddress}</div>
        </div>
      </div>
    </div>
  );
};

export default AddressSelectAll;
