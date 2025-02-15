import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slice/countSlice";

export default configureStore({
  reducer: {
    counter: counterReducer
  }
});