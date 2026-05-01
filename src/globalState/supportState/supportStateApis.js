import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const supportStateApis = createApi({
    reducerPath: "supportState",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/user/support`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", token);
            }
            return headers;
        }
    }),
    tagTypes: ["supportTicket"],
    endpoints: (builder) => ({
        createSupportTicket: builder.mutation({
            query: (data) => ({
                url: "/create",
                method: "POST",
                body: data
            }),
            invalidatesTags: [{ type: 'supportTicket', id: "PARTIAL-LIST" }]
        }),
        replaySupportTicket: builder.mutation({
            query: (data) => ({
                url: "/replay",
                method: "PUT",
                body: data
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'supportTicket', id: arg.ticketId },
                { type: 'supportTicket', id: 'PARTIAL-LIST' }
            ]
        }),
        closeSupportTicket: builder.mutation({
            query: (data) => ({
                url: "/close",
                method: "POST",
                body: data
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'supportTicket', id: arg.ticketId },
                { type: 'supportTicket', id: 'PARTIAL-LIST' }
            ]
        }),
        supportTicketList: builder.query({
            query: ({ page = 1, sizePerPage = 10, status }) => {
                const params = {};

                if (page > 0) params.page = page;
                if (sizePerPage > 0) params.sizePerPage = sizePerPage;
                if (status) params.status = status;

                return {
                    url: "/list",
                    params,
                };
            },
            providesTags: (result) => {
                const data = result?.data?.ticketList || []
                return data.length > 0
                    ?
                    [
                        ...data.map(({ id }) => ({ type: 'supportTicket', id })),
                        { type: 'supportTicket', id: 'PARTIAL-LIST' },
                    ]
                    :
                    [{ type: 'supportTicket', id: 'PARTIAL-LIST' }]
            },
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
        supportTicketById: builder.query({
            query: ({ id }) => {
                const params = {};
                if (id) params.id = id;

                return {
                    url: `/${id}`,
                    params,
                };
            },
            providesTags: (result, error, arg) =>
                result?.data?.id
                    ? [{ type: 'supportTicket', id: result.data.id }]
                    : [{ type: 'supportTicket', id: 'PARTIAL-LIST' }],
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: true,
        }),
    })
})

export const {
    useCreateSupportTicketMutation,
    useSupportTicketListQuery,
    useSupportTicketByIdQuery,
    useReplaySupportTicketMutation,
    useCloseSupportTicketMutation
} = supportStateApis;