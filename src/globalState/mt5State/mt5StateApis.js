import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mt5StateApis = createApi({
    reducerPath: "mt5Apis",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/user/mt5`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", token);
            }
            return headers;
        },
    }),
    tagTypes: ["MT5AccountList"],
    endpoints: (builder) => ({
        addMT5Account: builder.mutation({
            query: (data) => ({
                url: "/create/account",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["MT5AccountList"]
        }),
        addDemoAccountBalance: builder.mutation({
            query: (data) => ({
                url: "/add/demo-balance",
                method: "POST",
                body: data
            })
        }),
        updateMT5Account: builder.mutation({
            query: (data) => ({
                url: "/update/account",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["MT5AccountList"]
        }),
        updateSymbol: builder.mutation({
            query: (data) => ({
                url: "/update/default-symbol",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["MT5AccountList"]
        }),
        updateMT5Password: builder.mutation({
            query: (data) => ({
                url: "/change-password",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["MT5AccountList"]
        }),
        mt5AccountBalance: builder.query({
            query: ({ login, flag }) => {

                const params = {};

                if (login) params.login = login
                if (flag == 1 || flag == 2 || flag == 0) params.flag = flag

                return {
                    url: "/user/check/balance",
                    params,
                };
            }
        }),
        mt5AccountList: builder.query({
            query: ({ page = 1, sizePerPage = 10, search, type }) => {

                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (search) params.search = search;
                if (type) params.type = type;

                return {
                    url: "/account/list",
                    params,
                };
            },
            providesTags: (result) => {
                const data = result?.data?.mt5AccountList || []
                return data.length > 0
                    ?
                    [
                        ...data.map(({ id }) => ({ type: 'MT5AccountList', id })),
                        { type: 'MT5AccountList', id: 'PARTIAL-LIST' },
                    ]
                    :
                    [{ type: 'MT5AccountList', id: 'PARTIAL-LIST' }]
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        mt5RequestList: builder.query({
            query: ({ page = 1, sizePerPage = 10, search }) => {

                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (search) params.search = search

                return {
                    url: "/requested/account/list",
                    params,
                };
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        getMT5AccountSymbol: builder.query({
            query: ({ id }) => {
                return {
                    url: `/account/${id}`,
                };
            }
        }),
    })
})

export const {
    useAddMT5AccountMutation,
    useAddDemoAccountBalanceMutation,
    useMt5AccountBalanceQuery,
    useMt5AccountListQuery,
    useUpdateMT5AccountMutation,
    useUpdateMT5PasswordMutation,
    useGetMT5AccountSymbolQuery,
    useMt5RequestListQuery,
    useUpdateSymbolMutation
} = mt5StateApis;