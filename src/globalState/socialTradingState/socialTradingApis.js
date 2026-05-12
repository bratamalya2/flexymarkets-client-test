import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const socialTradingApis = createApi({
    reducerPath: "socialTradingApis",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/user/master-trader`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token || localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", token);
            }
            return headers;
        },
    }),
    tagTypes: ["MasterTraderList", "MySubscriptions", "MyWatchlist", "MyMasterTraderProfile"],
    endpoints: (builder) => ({

        // Discovery - paginated list of all active master traders
        getMasterTraderList: builder.query({
            query: ({ page = 1, sizePerPage = 10, sortBy = "copiers", search, minWinRate, maxDrawdown, minReturn } = {}) => {
                const params = {};
                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (sortBy) params.sortBy = sortBy;
                if (search) params.search = search;
                if (minWinRate !== undefined) params.minWinRate = minWinRate;
                if (maxDrawdown !== undefined) params.maxDrawdown = maxDrawdown;
                if (minReturn !== undefined) params.minReturn = minReturn;
                return { url: "/list", params };
            },
            providesTags: [{ type: "MasterTraderList", id: "PARTIAL-LIST" }],
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),

        // Detail view for a single master trader
        getMasterTraderDetail: builder.query({
            query: ({ masterTraderId, chartTimeframe = "30D" }) => ({
                url: "/detail",
                params: { masterTraderId, chartTimeframe },
            }),
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),

        // Trade history for a master trader
        getMasterTraderTradeList: builder.query({
            query: ({ masterTraderId, page = 1, sizePerPage = 20 }) => ({
                url: `/trade-list/${masterTraderId}`,
                params: { page, sizePerPage },
            }),
            keepUnusedDataFor: 30,
            refetchOnMountOrArgChange: true,
        }),

        // Reviews list for a master trader
        getMasterTraderReviews: builder.query({
            query: ({ masterTraderId, page = 1, sizePerPage = 10 }) => ({
                url: `/reviews/${masterTraderId}`,
                params: { page, sizePerPage },
            }),
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),

        // Submit or update a review
        submitReview: builder.mutation({
            query: ({ masterTraderId, rating, comment }) => ({
                url: "/review",
                method: "POST",
                body: { masterTraderId, rating, comment },
            }),
        }),

        // Delete my review
        deleteReview: builder.mutation({
            query: ({ masterTraderId }) => ({
                url: `/review/${masterTraderId}`,
                method: "DELETE",
            }),
        }),

        // Subscribe to a master trader (starts copy trading)
        subscribeMasterTrader: builder.mutation({
            query: ({ masterTraderId, mt5Login }) => ({
                url: "/subscribe",
                method: "POST",
                body: { masterTraderId, mt5Login },
            }),
            invalidatesTags: ["MySubscriptions", { type: "MasterTraderList", id: "PARTIAL-LIST" }],
        }),

        // Unsubscribe from a master trader
        unsubscribeMasterTrader: builder.mutation({
            query: ({ subscriptionId }) => ({
                url: "/unsubscribe",
                method: "POST",
                body: { subscriptionId },
            }),
            invalidatesTags: ["MySubscriptions"],
        }),

        // My active/paused copy trade subscriptions
        getMySubscriptions: builder.query({
            query: ({ page = 1, sizePerPage = 10, status } = {}) => {
                const params = { page, sizePerPage };
                if (status) params.status = status;
                return { url: "/my-subscriptions", params };
            },
            providesTags: ["MySubscriptions"],
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),

        // Pause an active subscription
        pauseSubscription: builder.mutation({
            query: ({ subscriptionId, reason }) => ({
                url: "/subscription/pause",
                method: "POST",
                body: { subscriptionId, reason },
            }),
            invalidatesTags: ["MySubscriptions"],
        }),

        // Resume a paused subscription
        resumeSubscription: builder.mutation({
            query: ({ subscriptionId }) => ({
                url: "/subscription/resume",
                method: "POST",
                body: { subscriptionId },
            }),
            invalidatesTags: ["MySubscriptions"],
        }),

        // Watch a master trader (add to watchlist)
        watchMasterTrader: builder.mutation({
            query: ({ masterTraderId, notificationsEnabled = true }) => ({
                url: "/watch",
                method: "POST",
                body: { masterTraderId, notificationsEnabled },
            }),
            invalidatesTags: ["MyWatchlist"],
        }),

        // Remove from watchlist
        unwatchMasterTrader: builder.mutation({
            query: ({ masterTraderId }) => ({
                url: `/unwatch/${masterTraderId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["MyWatchlist"],
        }),

        // My watchlist
        getMyWatchlist: builder.query({
            query: ({ page = 1, sizePerPage = 10 } = {}) => ({
                url: "/my-watchlist",
                params: { page, sizePerPage },
            }),
            providesTags: ["MyWatchlist"],
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),

        // My master trader profile (self-service)
        getMyMasterTraderProfile: builder.query({
            query: () => ({ url: "/my-profile" }),
            providesTags: ["MyMasterTraderProfile"],
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),

        updateMyMasterTraderProfile: builder.mutation({
            query: (body) => ({ url: "/my-profile", method: "PUT", body }),
            invalidatesTags: ["MyMasterTraderProfile"],
        }),

        uploadMasterTraderPhoto: builder.mutation({
            query: (formData) => ({
                url: "/my-profile/photo",
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["MyMasterTraderProfile"],
        }),

        uploadMasterTraderCoverPhoto: builder.mutation({
            query: (formData) => ({
                url: "/my-profile/cover-photo",
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["MyMasterTraderProfile"],
        }),

        // Toggle watchlist notifications for a master trader
        toggleWatchlistNotifications: builder.mutation({
            query: ({ masterTraderId, notificationsEnabled }) => ({
                url: "/watchlist/notification",
                method: "PUT",
                body: { masterTraderId, notificationsEnabled },
            }),
            invalidatesTags: ["MyWatchlist"],
        }),
    }),
});

export const {
    useGetMasterTraderListQuery,
    useGetMasterTraderDetailQuery,
    useGetMasterTraderTradeListQuery,
    useGetMasterTraderReviewsQuery,
    useSubmitReviewMutation,
    useDeleteReviewMutation,
    useSubscribeMasterTraderMutation,
    useUnsubscribeMasterTraderMutation,
    useGetMySubscriptionsQuery,
    usePauseSubscriptionMutation,
    useResumeSubscriptionMutation,
    useWatchMasterTraderMutation,
    useUnwatchMasterTraderMutation,
    useGetMyWatchlistQuery,
    useToggleWatchlistNotificationsMutation,
    useGetMyMasterTraderProfileQuery,
    useUpdateMyMasterTraderProfileMutation,
    useUploadMasterTraderPhotoMutation,
    useUploadMasterTraderCoverPhotoMutation,
} = socialTradingApis;
