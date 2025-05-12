import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/api/apiSlice/conf/baseQuery";
import { Subjects } from "../../types/choices";

export const getSubjectApi = createApi({
  reducerPath: "getSubjectApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Subject"],
  endpoints: (builder) => ({
    getSubject: builder.query<Subjects[], void>({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_SUBJECTS}`,
        method: "GET",
      }),
      providesTags: ["Subject"],
    }),
  }),
});

export const { useGetSubjectQuery } = getSubjectApi;