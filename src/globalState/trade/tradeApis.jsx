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
            // invalidatesTags: [{ type: 'bankDepositWithdrawalList', id: "PARTIAL-LIST" }]
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
    })
})

export const {
    usePlaceOrderMutation,
    useCloseOrderMutation,
    useLimitTradeRequestMutation,
    useClosedOrderListQuery
} = tradeStateApis;