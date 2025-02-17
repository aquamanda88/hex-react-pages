import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./countSlice";
import toastReducer from "./toastSlice";

const store = configureStore({
  reducer: {
    counter: counterReducer,
    toast: toastReducer
  }
});

export default store;