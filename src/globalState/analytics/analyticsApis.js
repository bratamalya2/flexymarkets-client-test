import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const analyticsApis = createApi({
    reducerPath: "analyticsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/user/analytics`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", token);
            }
            return headers;
        },
    }),
    tagTypes: ["fundamentalAnalysis"],
    endpoints: (builder) => ({
        fundamentalAnalysis: builder.query({
            query: ({ symbol }) => ({
                url: "/fundamental",
                params: { symbol },
            }),
            transformResponse: (response) => response?.data ?? null,
            keepUnusedDataFor: 900,
            providesTags: (_result, _error, { symbol }) => [
                { type: "fundamentalAnalysis", id: symbol || "CURRENT" },
            ],
        }),
    }),
});

export const {
    useFundamentalAnalysisQuery,
} = analyticsApis;
