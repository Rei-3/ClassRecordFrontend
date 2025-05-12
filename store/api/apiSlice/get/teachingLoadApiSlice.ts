import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/api/apiSlice/conf/baseQuery";
import { Enrolled, TeachingLoad } from "../../types/teachingLoadTypes";

export const getTeachingLoad = createApi({
  reducerPath: "getTeachingLoad",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["TeachingLoad", "Enrolled"],
  endpoints: (builder) => ({
    getTeachingLoad: builder.query<TeachingLoad[], void>({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_TEACHINGLOAD}`,
        method: "GET",
      }),
      providesTags: ["TeachingLoad"],
    }),
    getEnrolled: builder.query<Enrolled[], number>({
      query: (teachingLoadDetailId) => ({
        url: `${process.env.NEXT_PUBLIC_VIEW_ENROLLED}/${teachingLoadDetailId}`,
        method: "GET",
      }),
      providesTags: (result, error, teachingLoadDetailId) => [
        { type: 'Enrolled', id: teachingLoadDetailId }
      ],
    }),
  }),
});

export const { useGetTeachingLoadQuery, useGetEnrolledQuery } = getTeachingLoad;
