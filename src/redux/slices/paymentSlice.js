import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    userPayment: [],
  },
  reducers: {
    setPaymentt: (state, action) => {
      state.userPayment = action.payload;
    },
    addPaymentt: (state, action) => {
      state.userPayment.push(action.payload);
    },
    removePayment: (state, action) => {
      state.userPayment = state.userPayment.filter(payment => payment._id !== action.payload);
    },
  },
});

export const { setPaymentt, addPaymentt, removePayment } = paymentSlice.actions;

export default paymentSlice.reducer;
