import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./slices/transactionSlice";

const store = configureStore({
    reducer: {
        transactions: transactionReducer,
    },
});

export default store;
