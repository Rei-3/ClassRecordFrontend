import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/api/apiSlice/conf/baseQuery";
import {
  TeachingLoadDetailsRequest,
  TeachingLoadRequest,
} from "../../types/teachingLoadTypes";

export const postTeachingLoadApi = createApi({
  reducerPath: "postTeachingLoad",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Post_TeachingLoad"],
  endpoints: (builder) => ({
    postTeachingLoad: builder.mutation<
      { id: number; message: string },
      TeachingLoadRequest
    >({
      query: (teachingLoad) => ({
        url: `${process.env.NEXT_PUBLIC_ADD_TEACHINGLOAD}`,
        method: "POST",
        body: teachingLoad,
      }),
      invalidatesTags: ["Post_TeachingLoad"],
    }),

    postTeachingLoadDetails: builder.mutation<
      { message: string },
      TeachingLoadDetailsRequest
    >({
      query: (teachingLoadDetails) => ({
        url: `${process.env.NEXT_PUBLIC_ADD_TEACHINGLOAD_DETAILS}`,
        method: "POST",
        body: teachingLoadDetails,
      }),
      invalidatesTags: ["Post_TeachingLoad"],
    }),

    postSendRequest: builder.mutation<
      { message: string },
      { teachingLoadId: number }
    >({
      query: ({ teachingLoadId }) => ({
        url: `${process.env.NEXT_PUBLIC_SEND_REQUEST_EDIT_STATUS}/${teachingLoadId}`,
        method: "POST",
        body: {}, // Include an empty body if your endpoint expects one
      }),
      invalidatesTags: ["Post_TeachingLoad"],
    }),
  }),
});

export const {
  usePostTeachingLoadMutation,
  usePostTeachingLoadDetailsMutation,
  usePostSendRequestMutation
} = postTeachingLoadApi;
