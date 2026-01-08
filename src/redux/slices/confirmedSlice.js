import { createSlice } from '@reduxjs/toolkit';

const confirmed = createSlice({
  name: 'todo',
  initialState: {
    userTodos: [],
  },
  reducers: {
    setConfirmed: (state, action) => {
      state.userTodos = action.payload;
    },
  },
});

export const { setConfirmed} = confirmed.actions;

export default confirmed.reducer;
