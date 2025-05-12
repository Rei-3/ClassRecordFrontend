import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/api/apiSlice/conf/baseQuery";
import { Sem, Terms } from "../../types/choices";

export const getSemApi = createApi({
  reducerPath: "SubjectApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Sem", "Term"],
  endpoints: (builder) => ({
    getSem: builder.query<Sem[], void>({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SEM}`,
        method: "GET",
      }),
      providesTags: ["Sem"],
    }),
    getTerm: builder.query<Terms[], void>({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_TERMS}`,
        method: "GET",
      }),
      providesTags: ["Term"],
    }),
  }),
});

export const { useGetSemQuery, useGetTermQuery } = getSemApi;
