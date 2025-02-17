import { createSlice } from '@reduxjs/toolkit';

export interface RootState {
  toast: {
    messages: MessagesState[];
    isToastOpen: boolean;
  };
}

export interface MessagesState {
  id: number;
  text: string;
  status: string;
}

const initialState = {
  messages: [
    {
      id: Date.now(),
      text: 'Hello',
      status: 'success',
    },
  ],
  isToastOpen: false,
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    toggleToast: (state, action) => {
      state.isToastOpen = action.payload;
    },
    updateMessage: (state, action) => {
      const { text, status } = action.payload;
      const id = Date.now();

      state.messages = [
        {
          id,
          text,
          status,
        },
      ];
    },
  },
});

export const messages = (state: RootState) => state.toast.messages;
export const toastOpen = (state: RootState) => state.toast.isToastOpen;
export const { toggleToast, updateMessage } = toastSlice.actions;
export default toastSlice.reducer;
