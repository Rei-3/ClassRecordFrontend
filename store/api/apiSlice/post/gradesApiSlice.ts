import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../conf/baseQuery";
import {
  AttendanceSheet,
  BaseGradeMutation,
  PostAddActivity,
  PostGradingComposition,
  RecordScore,
} from "../../types/classRecord";
import { method } from "lodash";
// adjust path as needed

export const postGradesApiSlice = createApi({
  reducerPath: "postGrades",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Post_GradingComposition", "Post_AddActivity", "Post_AddActivity","Post_RecordGrades","Post_BaseGradeMutation"],
  endpoints: (builder) => ({
    postGradingComposition: builder.mutation<
      { message: string },
      PostGradingComposition
    >({
      query: (gradingComposition) => ({
        url: `${process.env.NEXT_PUBLIC_ADD_GRADING_COMPOSITION}`,
        method: "POST",
        body: gradingComposition,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post_GradingComposition", id: arg.teachingLoadDetailId },
      ],
    }),
    postAddActivity: builder.mutation<{ message: string }, PostAddActivity>({
      query: (addActivity) => ({
        url: `${process.env.NEXT_PUBLIC_ADD_ACTIVITY}`,
        method: "POST",
        body: addActivity,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post_AddActivity", id: arg.teachingLoadDetailId },
      ],
    }),
    postRecordGrades: builder.mutation<{ message: string }, RecordScore[]>({
      query: (recordScore) => ({
        url: `${process.env.NEXT_PUBLIC_RECORD_GRADES}`,
        method: "POST",
        body: recordScore,
      }),
      invalidatesTags: (result, error, arg) =>
        arg.map((item) => ({
          type: "Post_RecordGrades",
          id: item.gradingId, // Ensure gradingId is a string or number
        })),
    }),
    postBaseGradeMutation : builder.mutation<
    {message: string},
    BaseGradeMutation
    >({
      query:(BaseGradeMutation)=> ({
        url: `${process.env.NEXT_PUBLIC_POST_BASE_GRADE}`,
        method: "POST",
        body: BaseGradeMutation,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post_BaseGradeMutation", id: arg.teachingLoadDetailId },
      ],
    }),
    postMakeAttendanceForToday: builder.mutation<
    {message: string},
    AttendanceSheet
    >({
      query:(AttendanceSheet)=>({
        url: `${process.env.NEXT_PUBLIC_ADD_ATTENDANCE_SHEET}`,
        method: "POST",
        body: AttendanceSheet
      }),
    })
  }),
});

export const {
  usePostGradingCompositionMutation,
  usePostAddActivityMutation,
  usePostRecordGradesMutation,
  usePostBaseGradeMutationMutation,
  usePostMakeAttendanceForTodayMutation
} = postGradesApiSlice;
