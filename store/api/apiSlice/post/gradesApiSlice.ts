import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../conf/baseQuery";
import { PostAddActivity, PostGradingComposition, RecordScore } from "../../types/classRecord";
 // adjust path as needed

export const postGradesApiSlice = createApi({
  reducerPath: "postGrades",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Post_GradingComposition", "Post_AddActivity","Post_AddActivity"],
  endpoints: (builder) => ({
    postGradingComposition: builder.mutation<{message: string},PostGradingComposition>({
        query: (gradingComposition) => ({
            url: `${process.env.NEXT_PUBLIC_ADD_GRADING_COMPOSITION}`,
            method: "POST",
            body: gradingComposition,
        }),
        invalidatesTags: (result, error, arg) => [
          { type: 'Post_GradingComposition', id: arg.teachingLoadDetailId }
        ],
    }),
    postAddActivity: builder.mutation<{message: string}, PostAddActivity>({
       query: (addActivity) => ({
            url: `${process.env.NEXT_PUBLIC_ADD_ACTIVITY}`,
            method: "POST",
            body: addActivity,
       }),
        invalidatesTags: (result, error, arg) => [
          { type: 'Post_AddActivity', id: arg.teachingLoadDetailId }
        ],
    }),
    postRecordGrades: builder.mutation<{message: string},RecordScore[] >({
        query: (recordScore) => ({
          url: `${process.env.NEXT_PUBLIC_RECORD_GRADES}`,
          method: "POST",
          body: recordScore,
        }),
        invalidatesTags: (result, error, arg) => 
          arg.map((item) => ({
            type: 'Post_AddActivity',
            id: item.gradingId // Ensure gradingId is a string or number
          })),
    })
  }),
});

export const { 
  usePostGradingCompositionMutation,
  usePostAddActivityMutation,
  usePostRecordGradesMutation
} = postGradesApiSlice;
