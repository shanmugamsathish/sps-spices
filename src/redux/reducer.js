import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import loaderReducer from "./loaderSlice";

const store = configureStore({
    reducer: {
        products: productReducer,
        loader: loaderReducer,
    },
});

export default store;