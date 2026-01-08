import { apiSlice } from './apiSlice';

const TODOS_URL = '/api/todos';

export const todoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getsTodos: builder.query({
      query: () => ({
        url: `${TODOS_URL}/`,
      }),
    }),
    addsTodo: builder.mutation({
      query: (todo) => ({
        url: `${TODOS_URL}/`,
        method: 'POST',
        body: todo,
      }),
    }),
    deleteeTodo: builder.mutation({
      query: (id) => ({
        url: `${TODOS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetsTodosQuery, useAddsTodoMutation, useDeleteeTodoMutation } = todoApiSlice;