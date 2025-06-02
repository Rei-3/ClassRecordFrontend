import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/api/apiSlice/conf/baseQuery";
import { Sem, Terms } from "../../types/choices";

export const getSemApi = createApi({
  reducerPath: "SubjectApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Sem", "Term", "Courses"],
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
    getCourses: builder.query<any, void>({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_COURSES_WITH_DEP}`,
        method: "GET",
      }),
      providesTags: ["Courses"], 
    }),
  }),
});

export const { useGetSemQuery, useGetTermQuery,
  useGetCoursesQuery
 } = getSemApi;
