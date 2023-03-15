import { Button, ConfigProvider } from "antd";
import "antd/dist/reset.css";
import { Route, Routes } from "react-router-dom";
import Main from "../components/admin/layout/Main";
import Category2 from "../views/admin/Category2";
import "./App.css";
import Bill from "./bill/Bill";
import CreateBill from "./bill/CreateBill";
import Category from "./category/Category";
import Customer from "./customer/Customer";
import Price from "./price/Price";
import AdminProducts from "./product/AdminProducts";

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
          <Route path="sub-category" element={<Category2 />} />
          <Route path="prices" element={<Price />} />
          <Route path="bills" element={<Bill />} />
          <Route path="customers" element={<Customer />} />
        </Route>
        <Route path="bills/create" element={<CreateBill />} />
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
