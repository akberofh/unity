import { apiSlice } from './apiSlice';
const API_BASE = process.env.REACT_APP_API_BASE_URL;
const TODOS_URL = `${API_BASE}/api/pagination`;

export const qolbaqApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQolbaq: builder.query({
      query: () => ({
        url: `${TODOS_URL}/`,
      }),
    }),
    addQolbaq: builder.mutation({
      query: (qolbaq) => ({
        url: `${TODOS_URL}/`,
        method: 'POST',
        body: qolbaq,
      }),
    }),
    addQolbaqJson: builder.mutation({
      query: (qolbaq) => ({
        url: `${TODOS_URL}/json`,
        method: 'POST',
        body: qolbaq,
      }),
    }),
    updateQolbaq: builder.mutation({
        query: ({id , formData}) => ({
            url: `${API_BASE}/api/product/update/${id}`,
            method: 'PUT',
            body: formData
        })
    }),
    deleteQolbaq: builder.mutation({
      query: (id) => ({
        url: `${TODOS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetQolbaqQuery, useAddQolbaqMutation, useDeleteQolbaqMutation, useUpdateQolbaqMutation, useAddQolbaqJsonMutation } = qolbaqApiSlice;
