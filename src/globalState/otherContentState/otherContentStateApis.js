import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const otherContentStateApis = createApi({
    reducerPath: "adminApis",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/admin`,
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
        getBanner: builder.query({
            query: () => `/banner`
        }),
        getNotification: builder.query({
            query: () => `/banner/notification`
        }),
    })
})

export const {
    useGetBannerQuery,
    useGetNotificationQuery
} = otherContentStateApis;