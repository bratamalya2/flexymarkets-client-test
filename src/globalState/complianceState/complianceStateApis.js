import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const complianceStateApis = createApi({
    reducerPath: "compliance",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/user/compliance`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("Authorization", token);
            }
            return headers;
        }
    }),
    tagTypes: ["bankDetails"],
    endpoints: (builder) => ({
        addBank: builder.mutation({
            query: (data) => {
                const formData = new FormData();
                if (data.image instanceof File) {
                    formData.append("image", data.image);
                }
                const paramsObj = {
                    holderName: data.holderName || '',
                    accountNo: data.accountNo || '',
                    // ifscCode: data.ifscCode || '',
                    bankName: data.bankName || '',
                    bankAddress: data.bankAddress || '',
                    country: data.country || '',
                };

                if (data.ibanNo) {
                    paramsObj.ibanNo = data.ibanNo
                    paramsObj.ifscCode = data.ifscCode
                }
                const queryParams = new URLSearchParams(paramsObj).toString();

                return {
                    url: `/add/bank?${queryParams}`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'bankList', id: "PARTIAL-LIST" }]
        }),
        getBankDetails: builder.query({
            query: () => `/fetch/bank`,
            providesTags: ['bankDetails'],
        }),
        // uploadDocument: builder.mutation({
        //     query: (data) => {

        //         const formData = new FormData();

        //         if (data.poi instanceof File) {
        //             formData.append("poi", data.poi);
        //         }
        //         if (data.poa instanceof File) {
        //             formData.append("poa", data.poa);
        //         }

        //         // const queryParams = new URLSearchParams({
        //         //     userId: data.userId || '',
        //         // }).toString();

        //         return {
        //             url: `/upload/doc`,
        //             method: "POST",
        //             body: formData,
        //         };
        //     },
        //     invalidatesTags: [{ type: 'documentList', id: "PARTIAL-LIST" }]
        // }),
        uploadDocument: builder.mutation({
            query: (data) => {

                const formData = new FormData();

                if (data.poi instanceof File) {
                    formData.append("poi", data.poi);
                }
                if (data.poa instanceof File) {
                    formData.append("poa", data.poa);
                }
                if (data.extraDocs instanceof File) {
                    formData.append("extraDocs", data.extraDocs);
                }

                if (Array.isArray(data.extraDocs) && data.extraDocs.length > 0) {
                    data.extraDocs.forEach((file) => {
                        formData.append("extraDocs", file);
                    });
                }

                return {
                    url: `/upload/doc`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: [{ type: 'documentList', id: "PARTIAL-LIST" }]
        }),
        getDocumentData: builder.query({
            query: () => `/document/details`,
            providesTags: ['documentDetails'],
        }),
    })
})

export const {
    useAddBankMutation,
    useUploadDocumentMutation,
    useGetDocumentDataQuery
} = complianceStateApis;