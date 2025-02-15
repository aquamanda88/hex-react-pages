import { createSlice } from '@reduxjs/toolkit';

interface RootState {
  counter: {
    count: number;
  };
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    count: 0,
  },
  reducers: {
    calculateCartCount: (state, action) => {
      state.count = action.payload;
    }
  },
});

// 匯出 action，供元件觸發狀態變更
export const { calculateCartCount } = counterSlice.actions;
// 匯出 selector，用於從 store 中取得 counter 值
export const selectCount = (state: RootState) => state.counter.count;
// 匯出 reducer，供 store 註冊
export default counterSlice.reducer;
