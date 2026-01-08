import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
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
    addConfirm: (state, action) => {
      state.userTodos.push(action.payload);
    },
    addPayment: (state, action) => {
      state.userTodos.push(action.payload);
    },
    removeTodo: (state, action) => {
      state.userTodos = state.userTodos.filter(todo => todo._id !== action.payload);
    },
    updateTodo: (state, action) => {
      const index = state.userTodos.findIndex(
        (item) => item.productId === action.payload.productId
      );
      if (index !== -1) {
        state.userTodos[index] = {
          ...state.userTodos[index],
          quantity: action.payload.quantity,
          totalPrice: action.payload.quantity * state.userTodos[index].price,
        };
      }
    },
  },
});

export const { setTodos, addTodo, removeTodo, updateTodo,addConfirm , addPayment} = productSlice.actions;

export default productSlice.reducer;
