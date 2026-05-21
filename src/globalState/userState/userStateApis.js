import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userStateApis = createApi({
    reducerPath: "user",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/user`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", token);
            }
            return headers;
        }
    }),
    tagTypes: ["bankDepositWithdrawalList", "userData", "ibClientTrxList"],
    endpoints: (builder) => ({
        updateProfile: builder.mutation({
            query: (data) => ({
                url: "/profile/update",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["userData"]
        }),
        acceptPromotion: builder.mutation({
            query: (data) => ({
                url: "/accept-promotional",
                method: "POST",
                body: data
            })
        }),
        updateSecurityMethod: builder.mutation({
            query: (data) => ({
                url: "/update/security-method",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["userData"]
        }),
        getUserData: builder.query({
            query: () => `/updated/data`,
            providesTags: ["userData"]
        }),
        bankDeposit: builder.mutation({
            query: (data) => {
                const formData = new FormData();
                if (data.image instanceof File) {
                    formData.append("image", data.image);
                }
                const queryParams = new URLSearchParams({
                    transactionReference: data.transactionReference || '',
                    amount: data.amount || '',
                    remark: data.remark || '',
                }).toString();

                return {
                    url: `/bank/deposit?${queryParams}`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'bankDepositWithdrawalList', id: "PARTIAL-LIST" }]
        }),
        bankWithdraw: builder.mutation({
            query: (data) => ({
                url: "/bank/withdraw",
                method: "POST",
                body: data
            }),
            invalidatesTags: [{ type: 'bankDepositWithdrawalList', id: "PARTIAL-LIST" }]
        }),
        cryptoWithdraw: builder.mutation({
            query: (data) => (
                {
                    url: `/withdraw`,
                    method: "POST",
                    body: data
                }
            ),
            invalidatesTags: [{ type: 'bankDepositWithdrawalList', id: "PARTIAL-LIST" }]
        }),
        depositWithdrawaList: builder.query({
            query: ({ page = 1, sizePerPage = 10, search = "", status, transactionType, paymentMethod, fromDate, toDate }) => {
                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (search) params.search = search;
                if (status) params.status = status;
                if (transactionType) params.transactionType = transactionType;
                if (paymentMethod) params.paymentMethods = paymentMethod;
                if (fromDate) params.fromDate = fromDate;
                if (toDate) params.toDate = toDate;

                return {
                    url: "/deposit-withdraw/list",
                    params,
                };
            },
            providesTags: (result) => {
                const data = result?.data?.usersList || []
                return data.length > 0
                    ?
                    [
                        ...data.map(({ id }) => ({ type: 'bankDepositWithdrawalList', id })),
                        { type: 'bankDepositWithdrawalList', id: 'PARTIAL-LIST' },
                    ]
                    :
                    [{ type: 'bankDepositWithdrawalList', id: 'PARTIAL-LIST' }]
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        transactionList: builder.query({
            query: ({ page = 1, sizePerPage = 10, search = "", status, transactionType, paymentMethod, fromDate, toDate, login }) => {
                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (search) params.search = search;
                if (status) params.status = status;
                if (transactionType) params.transactionType = transactionType;
                if (paymentMethod) params.paymentMethods = paymentMethod;
                if (fromDate) params.fromDate = fromDate;
                if (toDate) params.toDate = toDate;
                if (login) params.login = login;

                return {
                    url: "/transaction/list",
                    params,
                };
            },
            providesTags: (result) => {
                const data = result?.data?.usersList || []
                return data.length > 0
                    ?
                    [
                        ...data.map(({ id }) => ({ type: 'bankDepositWithdrawalList', id })),
                        { type: 'bankDepositWithdrawalList', id: 'PARTIAL-LIST' },
                    ]
                    :
                    [{ type: 'bankDepositWithdrawalList', id: 'PARTIAL-LIST' }]
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        getReferralTree: builder.query({
            query: () => `/referral/tree`
        }),
        getReferralList: builder.query({
            query: () => `/referral/list`
        }),
        getReferralInfo: builder.query({
            query: ({ referralCode }) => {

                const params = {};
                if (referralCode) params.referralCode = referralCode;

                return {
                    url: "/profile/referral/info",
                    params,
                };

            }
        }),
        metaWithdraw: builder.mutation({
            query: (data) => ({
                url: "/meta/withdraw",
                method: "POST",
                body: data
            })
        }),
        metaDeposit: builder.mutation({
            query: (data) => ({
                url: "/meta/deposit",
                method: "POST",
                body: data
            })
        }),
        activeMT5AccountBalance: builder.query({
            query: ({ login }) => {

                const params = {};

                if (login) params.login = login
                return {
                    url: "/trade/check/balance",
                    params,
                };
            }
        }),
        getEconomicCalenderData: builder.query({
            query: () => `/analytics/economics-calender`
        }),
        getPaymentCharges: builder.query({
            query: () => `/payment-charges/list`,
        }),
        getIbClientTrxList: builder.query({
            query: ({ page = 1, sizePerPage = 10, transactionType, status, fromDate, toDate } = {}) => {
                const params = {};
                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (transactionType) params.transactionType = transactionType;
                if (status) params.status = status;
                if (fromDate) params.fromDate = fromDate;
                if (toDate) params.toDate = toDate;
                return { url: "/ib/client/trx-list", params };
            },
            providesTags: (result) => {
                const data = result?.data?.trxList || [];
                return data.length > 0
                    ? [...data.map(({ id }) => ({ type: "ibClientTrxList", id })), { type: "ibClientTrxList", id: "PARTIAL-LIST" }]
                    : [{ type: "ibClientTrxList", id: "PARTIAL-LIST" }];
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
    })
})

export const {
    useGetUserDataQuery,
    useBankDepositMutation,
    useBankWithdrawMutation,
    useDepositWithdrawaListQuery,
    useTransactionListQuery,
    useUpdateProfileMutation,
    useUpdateSecurityMethodMutation,
    useGetReferralTreeQuery,
    useGetReferralListQuery,
    useGetReferralInfoQuery,
    useMetaDepositMutation,
    useMetaWithdrawMutation,
    useCryptoWithdrawMutation,
    useActiveMT5AccountBalanceQuery,
    useGetEconomicCalenderDataQuery,
    useAcceptPromotionMutation,
    useGetPaymentChargesQuery,
    useGetIbClientTrxListQuery,
} = userStateApis;