import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import loaderReducer from "./loaderSlice";
import userReducer from "./userSlice";

const store = configureStore({
    reducer: {
        products: productReducer,
        loader: loaderReducer,
        user: userReducer,
    },
});

export default store;