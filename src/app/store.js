import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../store/slices/productSlice";
import cateReducer from "../store/slices/cateSlice";
import priceHeaderReducer from "../store/slices/priceHeaderSlice";
import priceLineReducer from "../store/slices/priceLineSlice";

const rootReducer = {
  product: productReducer,
  cate: cateReducer,
  priceHeader: priceHeaderReducer,
  priceLine: priceLineReducer,
};

export const store = configureStore({
  reducer: rootReducer,
});
