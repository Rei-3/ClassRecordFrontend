import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../conf/baseQuery";
import { Editscore, PutGradingComposition } from "../../types/classRecord";

export const putGradesApiSlice = createApi({
    reducerPath: "putGrades",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Put_GradingComposition","Put_GradingComposition"],
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
        })
    })
})

export const {
    usePutGradingCompositionMutation,
    usePutEditScoreMutation
} = putGradesApiSlice;