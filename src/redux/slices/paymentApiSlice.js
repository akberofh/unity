import { apiSlice } from './apiSlice';

const TODOS_URL = '/api/payment';

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentt: builder.query({
      query: () => ({
        url: `${TODOS_URL}/`,
      }),
    }),
    addPaymentt: builder.mutation({
      query: (payment) => ({
        url: `${TODOS_URL}/`,
        method: 'POST',
        body: payment,
      }),
    }),
    deletePayment: builder.mutation({
      query: (id) => ({
        url: `${TODOS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetPaymenttQuery, useAddPaymenttMutation, useDeletePaymentMutation } = paymentApiSlice;
