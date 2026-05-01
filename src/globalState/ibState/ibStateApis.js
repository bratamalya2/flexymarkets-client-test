import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ibStateApis = createApi({
    reducerPath: "IB",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/user/ib`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", token);
            }
            return headers;
        }
    }),
    tagTypes: ["IBTeamDepositWithdrawReport", "ibCommissionList"],
    endpoints: (builder) => ({
        requestForIB: builder.mutation({
            query: (data) => ({
                url: "/request",
                method: "POST",
                body: data
            })
        }),
        makeSubIB: builder.mutation({
            query: (data) => ({
                url: "/make-subib",
                method: "PUT",
                body: data
            })
        }),
        IBWithdraw: builder.mutation({
            query: (data) => ({
                url: "/withdraw",
                method: "POST",
                body: data
            }),
            invalidatesTags: [
                { type: 'IBTeamDepositWithdrawReport', id: "PARTIAL-LIST" },
                { type: 'myCommissionList', id: "PARTIAL-LIST" }
            ]
        }),
        myCommissionList: builder.query({
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
                    url: "/comission-list",
                    params,
                };
            },
            providesTags: (result) => {
                const data = result?.data?.comissionTrxList || []
                return data.length > 0
                    ?
                    [
                        ...data.map(({ id }) => ({ type: 'myCommissionList', id })),
                        { type: 'myCommissionList', id: 'PARTIAL-LIST' },
                    ]
                    :
                    [{ type: 'myCommissionList', id: 'PARTIAL-LIST' }]
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        // IBTeamDepositWithdrawReport: builder.query({
        //     query: ({ page = 1, sizePerPage = 10, search = "", status, transactionType, paymentMethod, fromDate, toDate }) => {
        //         const params = {};

        //         if (page > 0) params.page = page;
        //         if (sizePerPage > 0) params.sizePerPage = sizePerPage;
        //         if (search) params.search = search;
        //         // if (status) params.status = status;
        //         if (transactionType) params.transactionType = transactionType;
        //         // if (paymentMethod) params.paymentMethods = paymentMethod;
        //         if (fromDate) params.fromDate = fromDate;
        //         if (toDate) params.toDate = toDate;

        //         return {
        //             url: "/report-list",
        //             params,
        //         };
        //     },
        //     providesTags: (result) => {
        //         const data = result?.data?.trxList || []
        //         return data.length > 0
        //             ?
        //             [
        //                 ...data.map(({ id }) => ({ type: 'IBTeamDepositWithdrawReport', id })),
        //                 { type: 'IBTeamDepositWithdrawReport', id: 'PARTIAL-LIST' },
        //             ]
        //             :
        //             [{ type: 'IBTeamDepositWithdrawReport', id: 'PARTIAL-LIST' }]
        //     },
        //     keepUnusedDataFor: 60,
        //     refetchOnMountOrArgChange: true,
        // }),
        IBTeamDepositWithdrawReport: builder.query({
            query: ({ page = 1, sizePerPage = 10, search = "", status, transactionType, paymentMethod, fromDate, toDate }) => {
                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (search) params.search = search;
                // if (status) params.status = status;
                if (transactionType) params.transactionType = transactionType;
                // if (paymentMethod) params.paymentMethods = paymentMethod;
                if (fromDate) params.fromDate = fromDate;
                if (toDate) params.toDate = toDate;

                return {
                    url: "/client/trx-list",
                    params,
                };
            },
            providesTags: (result) => {
                const data = result?.data?.trxList || []
                return data.length > 0
                    ?
                    [
                        ...data.map(({ id }) => ({ type: 'IBTeamDepositWithdrawReport', id })),
                        { type: 'IBTeamDepositWithdrawReport', id: 'PARTIAL-LIST' },
                    ]
                    :
                    [{ type: 'IBTeamDepositWithdrawReport', id: 'PARTIAL-LIST' }]
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        ibKycReport: builder.query({
            query: (
                // { page = 1, sizePerPage = 10, kycStatus }
            ) => {

                // const params = {};

                // if (page > 0) params.page = page;
                // if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                // if (kycStatus !== undefined) params.kycStatus = kycStatus;

                return {
                    url: "/kyc-report",
                    // params,
                };
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        IBTeamTransactionList: builder.query({
            query: ({ page = 1, sizePerPage = 10, search = "", transactionType, fromDate, toDate }) => {
                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (search) params.search = search;
                if (transactionType) params.transactionType = transactionType;
                if (fromDate) params.fromDate = fromDate;
                if (toDate) params.toDate = toDate;

                return {
                    url: "/my/client/transaction-list",
                    params,
                };
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        ftdReport: builder.query({
            query: (
                // { page = 1, sizePerPage = 10 }
            ) => {

                // const params = {};

                // if (page > 0) params.page = page;
                // if (sizePerPage > 0) params.sizePerPage = sizePerPage;

                return {
                    url: "/ftd-report",
                    // params,
                };
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        liveAccount: builder.query({
            query: (
                // { page = 1, sizePerPage = 10 }

            ) => {

                // const params = {};

                // if (page > 0) params.page = page;
                // if (sizePerPage > 0) params.sizePerPage = sizePerPage;

                return {
                    url: "/live-account",
                    // params,
                };
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        setIBCommission: builder.mutation({
            query: (data) => ({
                url: "/update-comission",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["ibCommissionList"]
        }),
        ibCommissionList: builder.query({
            query: ({ page = 1, sizePerPage = 10, search, planId }) => {

                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (search) params.search = search;
                if (planId) params.planId = planId;

                return {
                    url: "/comission",
                    params
                };
            },
            providesTags: ["ibCommissionList"]
        }),
        commissionPlanOverride: builder.mutation({
            query: (data) => ({
                url: "/plan/override",
                method: "POST",
                body: data
            })
        }),
    })
})

export const {
    useRequestForIBMutation,
    useMakeSubIBMutation,
    useMyCommissionListQuery,
    useIBTeamDepositWithdrawReportQuery,
    useIBWithdrawMutation,
    useIbKycReportQuery,
    useIBTeamTransactionListQuery,
    useFtdReportQuery,
    useLiveAccountQuery,
    useIbCommissionListQuery,
    useSetIBCommissionMutation,
    useCommissionPlanOverrideMutation
} = ibStateApis;