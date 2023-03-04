import { Button, ConfigProvider } from "antd";
import "antd/dist/reset.css";
import { Route, Routes } from "react-router-dom";
import Main from "../components/admin/layout/Main";
import Category1 from "../views/admin/Category1";
import Category2 from "../views/admin/Category2";
import AdminProducts from "./admin/AdminProducts";
import Price from "./admin/Price";
import "./App.css";
import Cart from "./cart/Cart";
import Home from "./home/Home";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#018547",
        },
      }}
    >
      <Routes>
        <Route path="/admin" element={<Main />}>
          <Route path="products/:active" element={<AdminProducts />} />
          <Route path="categories1" element={<Category1 />} />
          <Route path="categories2" element={<Category2 />} />
          <Route path="prices" element={<Price />} />
        </Route>
        <Route path="/custommer">
          <Route path="cart" element={<Cart />} />
          <Route path="" element={<Home />} />
        </Route>
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
