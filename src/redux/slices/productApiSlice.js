import { apiSlice } from './apiSlice';

const TODOS_URL = '/api/product';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => ({
        url: `${TODOS_URL}/`,
      }),
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: `${TODOS_URL}/`,
        method: 'POST',
        body: todo,
      }),
    }),
    addConfirm: builder.mutation({
      query: (todo) => ({
        url: `${TODOS_URL}/confirm`,
        method: 'POST',
        body: todo,
      }),
    }),
    addPayment: builder.mutation({
      query: (body) => ({
        url: `${TODOS_URL}/payment`,
        method: 'POST',
        body: body,
      }),
    }),
    updateTodo: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `${TODOS_URL}/stock/${productId}`, // Include productId in the URL
        method: 'PUT', // Use PATCH for partial updates
        body: { quantity }, // Send only the quantity in the body
      }),
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `${TODOS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetTodosQuery, useAddTodoMutation, useDeleteTodoMutation, useUpdateTodoMutation ,useAddConfirmMutation , useAddPaymentMutation} = productApiSlice;
