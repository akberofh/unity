import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
    credentials: 'include',
  });
export const apiSlice = createApi({
    baseQuery,
    tagTypes:['user'],
    endpoints:(builder) => ({})
})