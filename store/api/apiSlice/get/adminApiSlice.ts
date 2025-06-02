import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../conf/baseQuery";
import { TeachingLoadStatusEdit } from "../../types/classRecord";

export const getAdminApiSlice = createApi({
  reducerPath: "getAdminApiSlice",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    getAllUsers: builder.query<any, void>({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_ADMIN_ALL_USERS}`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
    getAllStudents: builder.query<any, void>({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_ADMIN_ALL_STUDENTS}`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
    getAllTeachers: builder.query<any, void>({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_ADMIN_ALL_TEACHERS}`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
    getAllTeachingLoad: builder.query<any, void>({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_ADMIN_ALL_TEACHING_LOAD}`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
    getAllTeachingLoadIdItsIdOnlyAndTlId: builder.query<any, void>({
        query: () => ({
            url: `${process.env.NEXT_PUBLIC_ADMIN_ALL_TEACHING_LOAD_ID}`,
            method: "GET",
        }),
        providesTags: ["Admin"],
        }),
    getAllEnrolledStudents: builder.query<any, { tld: number }>({
      query: ({ tld }) => ({
        url: `${process.env.NEXT_PUBLIC_ADMIN_ALL_ENROLLED_STUDENTS}`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
    putStatusTeachingLoad: builder.mutation<any, TeachingLoadStatusEdit>({
      query: ({ teachingLoadId, status }) => ({
        url: `${process.env.NEXT_PUBLIC_ADMIN_PUT_STATUS_TEACHING_LOAD}`,
        method: "PUT",
        body: { teachingLoadId, status },
      }),
      invalidatesTags: ["Admin"],
    }),
    getAllTeachingLoadDetail: builder.query<any, {teachingLoadId: number}>({
      query: ({teachingLoadId}) => ({
        url: `${process.env.NEXT_PUBLIC_ADMIN_ALL_TEACHING_LOAD_DETAIL}/${teachingLoadId}`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
  }),
});
export const {
  useGetAllUsersQuery,
  useGetAllStudentsQuery,
  useGetAllTeachersQuery,
    useGetAllTeachingLoadQuery,
    useGetAllTeachingLoadIdItsIdOnlyAndTlIdQuery,
    useGetAllEnrolledStudentsQuery,
  usePutStatusTeachingLoadMutation,
  useGetAllTeachingLoadDetailQuery,
    
} = getAdminApiSlice;
