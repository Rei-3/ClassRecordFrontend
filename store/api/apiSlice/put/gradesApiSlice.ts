import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../conf/baseQuery";
import { BaseGradeMutation, Editscore, PutGradingComposition } from "../../types/classRecord";

export const putGradesApiSlice = createApi({
    reducerPath: "putGrades",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Put_GradingComposition","Put_GradingComposition", "Base_Grade"],
    endpoints: (builder) => ({
        putGradingComposition: builder.mutation<{message: string},PutGradingComposition>({
            query: (gradingComposition) => ({
                url: `${process.env.NEXT_PUBLIC_EDIT_GRADING_COMPOSITION}`,
                method: "PUT",
                body: gradingComposition,
            }),
            invalidatesTags: [
              'Put_GradingComposition' 
            ],
        }),
        putEditScore:builder.mutation<{message: string},Editscore >({
            query: (editScore)=> ({
                url: `${process.env.NEXT_PUBLIC_EDIT_SCORE}`,
                method: "PUT",
                body: editScore,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Put_GradingComposition', id: arg.gradingDetailId }
              ],
        }),
        putBaseGrade: builder.mutation<{ message: string}, {baseGradeId: number, data:BaseGradeMutation}>({
            query: ({baseGradeId, data}) => ({
                url: `${process.env.NEXT_PUBLIC_PUT_BASE_GRADE}/${baseGradeId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Base_Grade", id: arg.data.teachingLoadDetailId },
            ],
        }),
    })
})

export const {
    usePutGradingCompositionMutation,
    usePutEditScoreMutation,
    usePutBaseGradeMutation,
} = putGradesApiSlice;