import { Select } from "antd";
const onChange = (value) => {
  //console.log(`selected ${value}`);
};
const onSearch = (value) => {
  //console.log("search:", value);
};

const EmployeeSelect = () => {
  return (
    <div className="employee_select">
      <Select
        size="small"
        showSearch
        placeholder="Nhân viên bán hàng"
        optionFilterProp="children"
        onChange={onChange}
        onSearch={onSearch}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        options={[
          {
            value: "jack",
            label: "Jack",
          },
          {
            value: "lucy",
            label: "Lucy",
          },
          {
            value: "tom",
            label: "Tom",
          },
        ]}
        style={{
          width: "100%",
        }}
      />
    </div>
  );
};

export default EmployeeSelect;
