import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const groupStateApis = createApi({
    reducerPath: "groupState",
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
    tagTypes: ["groupList"],
    endpoints: (builder) => ({
        // addMT5Account: builder.mutation({
        //     query: (data) => ({
        //         url: "/create/account",
        //         method: "POST",
        //         body: data
        //     })
        // }),
        groupList: builder.query({
            query: ({ page = 1, sizePerPage = 10, search = "", type }) => {
                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (search) params.search = search;
                if (type) params.type = type

                return {
                    url: "/mt5/group/list",
                    params,
                };
            },
            providesTags: (result) => {
                const data = result?.data?.groupList || []
                return data.length > 0
                    ?
                    [
                        ...data.map(({ id }) => ({ type: 'groupList', id })),
                        { type: 'groupList', id: 'PARTIAL-LIST' },
                    ]
                    :
                    [{ type: 'groupList', id: 'PARTIAL-LIST' }]
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
    })
})

export const {
    // useAddMT5AccountMutation
    useGroupListQuery
} = groupStateApis;