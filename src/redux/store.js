import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import todoSlice from "./slices/todoSlice";
import { apiSlice } from "./slices/apiSlice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        todos: todoSlice,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;








