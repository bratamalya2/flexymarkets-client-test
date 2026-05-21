import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const socialTradingApis = createApi({
    reducerPath: "socialTrading",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/user/master-trader`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", token);
            }
            return headers;
        }
    }),
    tagTypes: ["watchList", "reviewList", "traderDetails", "subscribeList"],
    endpoints: (builder) => ({
        addMasterTraderIntoWatchList: builder.mutation({
            query: (data) => ({
                url: "/watch",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["watchList"]
        }),
        subscribe: builder.mutation({
            query: (data) => ({
                url: "/subscribe",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["subscribeList"]
        }),
        pauseSubscription: builder.mutation({
            query: (data) => ({
                url: "/subscription/pause",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["subscribeList"]
        }),
        resumeSubscription: builder.mutation({
            query: (data) => ({
                url: "/subscription/resume",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["subscribeList"]
        }),
        unSubscribe: builder.mutation({
            query: (data) => ({
                url: "/unsubscribe",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["subscribeList"]
        }),
        updateSubscribe: builder.mutation({
            query: (data) => ({
                url: "/subscription/settings",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["subscribeList"]
        }),
        submitReview: builder.mutation({
            query: (data) => ({
                url: "/review",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["reviewList", "traderDetails"]
        }),
        removeReview: builder.mutation({
            query: ({ masterTraderId }) => ({
                url: `/review/${masterTraderId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["reviewList", "traderDetails"]
        }),
        removeMasterTraderFromWatchList: builder.mutation({
            query: ({ masterTraderId }) => ({
                url: `/unwatch/${masterTraderId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["watchList"]
        }),
        masterTraderList: builder.query({
            query: ({ page = 1, sizePerPage = 10, chartTimeframe = "30D" }) => {

                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (chartTimeframe) params.chartTimeframe = chartTimeframe;

                return {
                    url: "/list",
                    params,
                };
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        mySubscriptionList: builder.query({
            query: ({ page = 1, sizePerPage = 10 }) => {

                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;

                return {
                    url: "/my-subscriptions",
                    params,
                };
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        myTraderWatchList: builder.query({

            query: ({ page = 1, sizePerPage = 10 }) => {

                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;

                return {
                    url: "/my-watchlist",
                    params,
                };
            },
            providesTags: ["watchList"],
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        getMasterTraderDetails: builder.query({
            query: ({ masterTraderId, chartTimeframe }) => {

                const params = {};

                if (masterTraderId) params.masterTraderId = masterTraderId;
                if (chartTimeframe) params.chartTimeframe = chartTimeframe;

                return {
                    url: "/detail",
                    params,
                };
            },
        }),
        masterTraderTradeList: builder.query({
            query: ({ page = 1, sizePerPage = 10, days = "30", masterTraderId }) => {

                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (days) params.days = days;

                return {
                    url: `/trade-list/${masterTraderId}`,
                    params,
                };
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        reviewList: builder.query({
            query: ({ page = 1, sizePerPage = 10, days = "30", masterTraderId }) => {

                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (days) params.days = days;

                return {
                    url: `/reviews/${masterTraderId}`,
                    params,
                };
            },
            providesTags: ["reviewList"],
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
    })
})

export const {
    useMasterTraderListQuery,
    useGetMasterTraderDetailsQuery,
    useAddMasterTraderIntoWatchListMutation,
    useMyTraderWatchListQuery,
    useRemoveMasterTraderFromWatchListMutation,
    useSubscribeMutation,
    useMySubscriptionListQuery,
    useMasterTraderTradeListQuery,
    useSubmitReviewMutation,
    useReviewListQuery,
    useRemoveReviewMutation,
    useUpdateSubscribeMutation,
    useUnSubscribeMutation,
    usePauseSubscriptionMutation,
    useResumeSubscriptionMutation
} = socialTradingApis;