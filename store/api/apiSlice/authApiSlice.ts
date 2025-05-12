import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/store/api/apiSlice/conf/baseQuery";
import { Login, Register, UsernanamePassword } from "../types/authType";

const registerUrl = process.env.NEXT_PUBLIC_REGISTER_TEACHER ?? "";
const usernameUrl= process.env.NEXT_PUBLIC_REGISTER_USERNAME ?? "";
const loginUrl = process.env.NEXT_PUBLIC_LOGIN ?? "";


export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        registerTeacher: builder.mutation<{ message: string }, Register>({
            query: (userData) => ({
                url: registerUrl,
                method: "POST",
                body: userData,
            }),
        }),
        registerTeacherUsername: builder.mutation<{ message: string, username: string
         }, 
        {otp: string, userData: UsernanamePassword}
        >({
            query: ({otp, userData}) => ({
                url: usernameUrl,
                method: "POST",
                params: { otp },
                body: userData,
            }),
        }),
        loginUser: builder.mutation<{
message: string, 
username: string, 
fname: string,
lname: string,
role: string,
token: string, 
refreshToken: string
}, Login >({
            query: (userData) => ({
                url: loginUrl,
                method: "POST",
                body: userData,
            }),
        })
    }),
});

export const { 
    useRegisterTeacherMutation, 
    useRegisterTeacherUsernameMutation,
    useLoginUserMutation
} = authApi;