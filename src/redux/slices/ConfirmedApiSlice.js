import { apiSlice } from './apiSlice';

const TODOS_URL = '/api';

export const ConfirmedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConfirmed: builder.query({
      query: () => ({
        url: `${TODOS_URL}/confirmed`,
      }),
    }),
  }),
});

export const {useGetConfirmedQuery } = ConfirmedApiSlice;
