import { createSlice } from '@reduxjs/toolkit';

const catagorySlice = createSlice({
  name: 'catagory',
  initialState: {
    userCatagory: [],
  },
  reducers: {
    setCatagory: (state, action) => {
      state.userCatagory = action.payload;
    },
    addCatagory: (state, action) => {
      state.userCatagory.push(action.payload);
    },
    removeCatagory: (state, action) => {
      state.userCatagory = state.userCatagory.filter(catagory => catagory._id !== action.payload);
    },
    updateCatagory: (state, action) => {
      const index = state.userCatagory.findIndex(catagory => catagory._id === action.payload._id);
      if (index !== -1) {
        state.userCatagory[index] = { ...state.userCatagory[index], ...action.payload };
      }
    },
  },
});

export const { setCatagory, addCatagory, removeCatagory, updateCatagory } = catagorySlice.actions;

export default catagorySlice.reducer;
