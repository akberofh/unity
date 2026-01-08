import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    userTodos: [],
  },
  reducers: {
    setTodos: (state, action) => {
      state.userTodos = action.payload;
    },
    addTodo: (state, action) => {
      state.userTodos.push(action.payload);
    },
    deleteeTodo: (state, action) => {
      state.userTodos = state.userTodos.filter(todo => todo._id !== action.payload);
    },
  },
});

export const { setTodos, addTodo, deleteeTodo } = todoSlice.actions;

export default todoSlice.reducer;