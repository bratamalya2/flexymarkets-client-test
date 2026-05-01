import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const referralStateApis = createApi({
    reducerPath: "referral",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/user/referral`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", token);
            }
            return headers;
        }
    }),
    tagTypes: [],
    endpoints: (builder) => ({
        referralList: builder.mutation({
            query: (data) => ({
                url: "/list",
                method: "POST",
                body: data
            })
        }),
    })
})

export const {
    useReferralListMutation
} = referralStateApis;