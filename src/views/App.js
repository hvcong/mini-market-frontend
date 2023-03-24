import { Button, ConfigProvider } from "antd";
import "antd/dist/reset.css";
import { Route, Routes } from "react-router-dom";
import Main from "../components/admin/layout/Main";
import AdminProducts from "./../components/product/AdminProducts";
import Price from "../components/price/Price";
import Bill from "./../components/bill/Bill";
import Promotion from "./../components/promotion/Promotion";
import UnitType from "../components/unittype/UnitType";
import StoreChanging from "./../components/store/StoreChanging";
import StoreChecking from "./../components/store/StoreChecking";
import CustomerGroup from "./../components/customerGroup/CustomerGroup";
import Employee from "./../components/employee/Employee";
import Customer from "./../components/customer/Customer";
import Category from "./../components/category/Category";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#018547",
          fontSize: 13,
        },
      }}
    >
      <Routes>
        <Route path="/admin" element={<Main />}>
          <Route path="products" element={<AdminProducts />} />
          <Route path="category" element={<Category />} />
          <Route path="prices" element={<Price />} />
          <Route path="bills" element={<Bill />} />
          <Route path="customers" element={<Customer />} />
          <Route path="promotion" element={<Promotion />} />
          <Route path="unitType" element={<UnitType />} />
          <Route path="store_change" element={<StoreChanging />} />
          <Route path="store_check" element={<StoreChecking />} />
          <Route path="customer_group" element={<CustomerGroup />} />
          <Route path="employee" element={<Employee />} />
        </Route>
        {/* <Route path="bills/create" element={<CreateBill />} /> */}
      </Routes>
    </ConfigProvider>
  );
}

export default App;

// grayLighter: "#ddd",
// gray: "#aaa",
// gray1: "#666",
// gray2: "#444",
// black: "#000",
// white: "#fff",
// greenLighter: "#05eb7e",
// green: "#04c469",
// green1: "#03a659",
// green2: "#018547",
// yellow: "yellow",
// red: "red",
