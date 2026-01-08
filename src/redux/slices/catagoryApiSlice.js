import { apiSlice } from './apiSlice';

const TODOS_URL = '/api/catagory';

export const catagoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCatagory: builder.query({
      query: () => ({
        url: `${TODOS_URL}/`,
      }),
    }),
    addCatagory: builder.mutation({
      query: (qolbaq) => ({
        url: `${TODOS_URL}/`,
        method: 'POST',
        body: qolbaq,
      }),
    }),
    updateCatagory: builder.mutation({
        query: ({ id, formData }) => ({
          url: `${TODOS_URL}/${id}`, // ID'yi URL'ye ekle
          method: 'PUT',
          body: formData, // FormData'yı body olarak gönder
        }),
      }),
      
    removeCatagory: builder.mutation({
      query: (id) => ({
        url: `${TODOS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetCatagoryQuery, useAddCatagoryMutation, useRemoveCatagoryMutation, useUpdateCatagoryMutation } = catagoryApiSlice;
