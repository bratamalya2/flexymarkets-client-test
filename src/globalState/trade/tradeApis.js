import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tradeStateApis = createApi({
    reducerPath: "trade",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/user/trade`,
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
        placeOrder: builder.mutation({
            query: (data) => ({
                url: "/send/trade/request",
                method: "POST",
                body: data
            }),
            // invalidatesTags: [{ type: 'bankDepositWithdrawalList', id: "PARTIAL-LIST" }]
        }),
        limitTradeRequest: builder.mutation({
            query: (data) => ({
                url: "/limit/order",
                method: "POST",
                body: data
            }),
            // invalidatesTags: [{ type: 'bankDepositWithdrawalList', id: "PARTIAL-LIST" }]
        }),
        closeOrder: builder.mutation({
            query: (data) => ({
                url: "/close/position",
                method: "POST",
                body: data
            }),
        }),
        closeLimitOrder: builder.mutation({
            query: (data) => ({
                url: "/close/limit/order",
                method: "POST",
                body: data
            }),
        }),
        closedOrderList: builder.query({
            query: ({ login }) => {
                const params = {};

                if (login) params.login = login;

                return {
                    url: "/closed/order-list",
                    params,
                };
            },
            transformResponse: (response) => {
                return {
                    data: response?.data ?? [],
                    // totalRecords: response?.data?.totalRecords ?? 0
                }
            },
        }),
        allBotList: builder.query({
            query: ({ page = 1, sizePerPage = 10, status }) => {

                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (status) params.status = status;

                return {
                    url: "/bot/list",
                    params,
                };
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        addSymbolToWatchList: builder.mutation({
            query: (data) => ({
                url: "/update/watchlist",
                method: "POST",
                body: data
            }),
            invalidatesTags: [{ type: 'watchList', id: "PARTIAL-LIST" }]
        }),
        watchList: builder.query({
            query: () => {

                return {
                    url: "/watchlist",
                };
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
            providesTags: [{ type: 'watchList', id: 'PARTIAL-LIST' }]
        }),
        openOrderList: builder.query({
            query: ({ login }) => ({
                url: `${import.meta.env.VITE_BASE_URL}/user/position/open-order/list`,
                params: login ? { login } : {}
            }),
            transformResponse: (response) => ({
                data: response?.data?.answer ?? response?.data ?? []
            }),
            keepUnusedDataFor: 30,
            refetchOnMountOrArgChange: true,
        }),
    })
})

export const {
    usePlaceOrderMutation,
    useCloseOrderMutation,
    useCloseLimitOrderMutation,
    useLimitTradeRequestMutation,
    useClosedOrderListQuery,
    useAllBotListQuery,
    useAddSymbolToWatchListMutation,
    useWatchListQuery,
    useOpenOrderListQuery
} = tradeStateApis;