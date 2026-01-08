import { createSlice } from '@reduxjs/toolkit';

const qolbaqSlice = createSlice({
  name: 'qolbaq',
  initialState: {
    userQolbaq: [],
  },
  reducers: {
    setQolbaq: (state, action) => {
      state.userQolbaq = action.payload;
    },
    addQolbaq: (state, action) => {
      state.userQolbaq.push(action.payload);
    },
    deleteQolbaq: (state, action) => {
      state.userQolbaq = state.userQolbaq.filter(qolbaq => qolbaq._id !== action.payload);
    },
    updateQolbaq: (state, action) => {
      const index = state.userQolbaq.findIndex(qolbaq => qolbaq._id === action.payload._id);
      if (index !== -1) {
        state.userQolbaq[index] = { ...state.userQolbaq[index], ...action.payload };
      }
    },
  },
});

export const { setQolbaq, addQolbaq, deleteQolbaq, updateQolbaq } = qolbaqSlice.actions;

export default qolbaqSlice.reducer;
