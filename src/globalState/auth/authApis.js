import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { login, setTokenExpTime } from "./authSlice";
import { jwtDecode } from "jwt-decode"

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/user/auth`,
        prepareHeaders: (headers, { getState }) => {
            const state = getState();
            const token = state.auth.token || state.auth.tempToken;
            if (token) {
                headers.set("Authorization", token);
            }
            return headers;
        },
    }),
    tagTypes: ["logInHistoryList", "userData"],
    endpoints: (builder) => ({
        signUp: builder.mutation({
            query: (data) => ({
                url: "/signup",
                method: "POST",
                body: data
            })
        }),
        logIn: builder.mutation({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.data) {
                        const decoded = jwtDecode(data?.data?.token);
                        dispatch(login(data?.data?.token));
                        dispatch(setTokenExpTime(decoded?.exp))
                    }
                } catch (error) {
                    console.error("Login failed:", error);
                }
            },
            invalidatesTags: [{ type: "logInHistoryList", id: "PARTIAL-LIST" }]
        }),
        // getUserProfile: builder.query({
        //     query: () => "/profile",
        //     providesTags: (result) =>
        //         result
        //             ? [{ type: "UserProfile", id: result?.data?.id || "CURRENT" }]
        //             : [{ type: "UserProfile", id: "CURRENT" }],
        // }),
        logInHistoryList: builder.query({
            query: ({ page = 1, sizePerPage = 5, userId }) => {
                const params = {};
                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (userId) params.userId = userId;

                return {
                    url: "/login/history",
                    params,
                };
            },
            providesTags: (result) => {
                const data = result?.data?.usersList || []
                return data.length > 0
                    ?
                    [
                        ...data.map(({ id }) => ({ type: 'logInHistoryList', id })),
                        { type: 'logInHistoryList', id: 'PARTIAL-LIST' },
                    ]
                    :
                    [{ type: 'logInHistoryList', id: 'PARTIAL-LIST' }]
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        forgotPasswordSendOTP: builder.mutation({
            query: (data) => ({
                url: "/forgot/password/send/otp",
                method: "POST",
                body: data
            })
        }),
        forgotPasswordVerifyOTP: builder.mutation({
            query: (data) => (
                {
                    url: "/forgot/password/verify/otp",
                    method: "PATCH",
                    body: data
                })
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: "/reset/password",
                method: "PUT",
                body: data
            })
        }),
        verifyEmailAndMobile: builder.mutation({
            query: (data) => ({
                url: "/send/otp",
                method: "POST",
                body: data
            })
        }),
        verifyEmailAndMobileOtp: builder.mutation({
            query: (data) => (
                {
                    url: "/verify/otp",
                    method: "PATCH",
                    body: data
                }
            ),
            // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
            //     try {
            //         const { data } = await queryFulfilled;
            //         if (data?.data) {
            //             dispatch(setUserData(data?.data))
            //         }
            //     } catch (error) {
            //         console.error("Login failed:", error);
            //     }
            // }
        }),
        mfaSetUp: builder.mutation({
            query: (data) => (
                {
                    url: `/setup/mfa`,
                    method: "POST",
                    body: data
                }
            ),
            invalidatesTags: ["userData"]
        }),
    })
})

export const {
    useSignUpMutation,
    useLogInMutation,
    useLogInHistoryListQuery,
    useForgotPasswordSendOTPMutation,
    useForgotPasswordVerifyOTPMutation,
    useResetPasswordMutation,
    useVerifyEmailAndMobileMutation,
    useVerifyEmailAndMobileOtpMutation,
    useMfaSetUpMutation
} = authApi;