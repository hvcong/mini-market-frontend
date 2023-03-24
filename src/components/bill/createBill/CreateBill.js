// import "../../../assets/styles/createBill.scss";
// import { InputNumber } from "antd";
// import React, { useEffect, useState } from "react";

// import { useSelector } from "react-redux";
// import SearchProductInput from "./SearchProductInput";
// import TabsCreateBill from "./TabsCreateBill";
// import ListProduct from "./ListProduct";
// import BillInfor from "./../../createBill/BillInfor";

// const CreateBill = () => {
//   const { tabState, listState } = useSelector((state) => state.createBill);

//   return (
//     <div className="create_bill_container">
//       <div className="header">
//         <SearchProductInput
//           placeholder="Thêm sản phẩm vào bảng giá"
//           style={{
//             width: "360px",
//           }}
//         />

//         <div className="scan_qr"></div>
//         <div className="tabs_wrap">
//           <TabsCreateBill />
//         </div>
//         <div className="right__btns"></div>
//       </div>

//       <div className="content">
//         <div className="list_container">
//           <ListProduct />
//         </div>
//         <div className="bill_infor_container">
//           <BillInfor />
//         </div>
//       </div>
//       <div className="footer"></div>
//     </div>
//   );
// };

// export default CreateBill;
