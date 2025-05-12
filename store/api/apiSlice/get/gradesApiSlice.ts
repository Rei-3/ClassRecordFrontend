import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../conf/baseQuery";
import { Grading, GradingComposition, GradingDetail, StudentFinal, StudentSemRecord } from "../../types/classRecord";
import { Category } from "../../types/choices";

export const getGradesApi = createApi ( {
    reducerPath: "getGradesApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["StudentSemRecord", "StudentFinal", "GradingComposition", "Category", "Grading", "GradingDetail"],
    endpoints: (builder) => ({

        getSemGrades: builder.query<StudentSemRecord[], { teachingLoadDetailId: number; termId: number }>({
            query: ({ teachingLoadDetailId, termId }) => ({
                url: `${process.env.NEXT_PUBLIC_TERM_GRADES}/${teachingLoadDetailId}/${termId}`,
                method: "GET",
            }),
            providesTags: (result, error, { teachingLoadDetailId }) => [
                { type: "StudentSemRecord", id: teachingLoadDetailId },
              ],
        }),

        getFinalGrades: builder.query<StudentFinal[], { teachingLoadDetailId: number}>({
            query: ({ teachingLoadDetailId }) => ({
                url: `${process.env.NEXT_PUBLIC_FINAL_GRADES}/${teachingLoadDetailId}`,
                method: "GET",
            }),
            providesTags: (result, error, { teachingLoadDetailId }) => [
                { type: "StudentFinal", id: teachingLoadDetailId },
              ],
        }),

        getGradingComposition: builder.query<GradingComposition, { teachingLoadDetailId: number }>({
            query: ({ teachingLoadDetailId }) => ({
                url: `${process.env.NEXT_PUBLIC_GRADING_COMPOSITION}/${teachingLoadDetailId}`,
                method: "GET",
            }),
            providesTags: (result, error, arg) => 
                result ? [{ type: 'GradingComposition', id: arg.teachingLoadDetailId }] : [],
        }),

        getGradeCategory: builder.query<Category[], void>({
            query: () => ({
                url: `${process.env.NEXT_PUBLIC_GRADE_CATEGORY}`,
                method: "GET",
            }),
            providesTags: ["Category"],
        }),
        getGrading: builder.query<Grading[], { 
            teachingLoadDetailId: number, 
            termId: number, 
            categoryId: number }>({
                query: ({ teachingLoadDetailId, termId, categoryId }) => ({
                    url: `${process.env.NEXT_PUBLIC_GRADING}/${teachingLoadDetailId}/${termId}/${categoryId}`,
                    method: "GET",
                }),
                providesTags: (result, error, { teachingLoadDetailId }) => [
                    { type: "Grading", id: teachingLoadDetailId },
                  ],
            }),
        getGradingDetail: builder.query<GradingDetail[], 
            {teachingLoadDetailId: number, 
            termId: number, 
            categoryId: number}>({
            query: ({ teachingLoadDetailId, termId, categoryId }) => ({
                url: `${process.env.NEXT_PUBLIC_GRADING_DETAIL}/${teachingLoadDetailId}/${termId}/${categoryId}`,
                method: "GET",
            }),
            providesTags: (result, error, { teachingLoadDetailId }) => [
                { type: "GradingDetail", id: teachingLoadDetailId },
              ],
        }), 
            
    }),
})

export const { 
    useGetSemGradesQuery, 
    useGetFinalGradesQuery, 
    useGetGradingCompositionQuery,
    useGetGradeCategoryQuery,
    useGetGradingQuery,
    useGetGradingDetailQuery,
} = getGradesApi;