import * as z from 'zod';

const fileTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
const defaultMaxSizeMb = 10;
const configuredMaxSizeMb = Number(import.meta.env.VITE_KYC_DOCUMENT_MAX_UPLOAD_MB);
const maxSizeMb = Number.isFinite(configuredMaxSizeMb) && configuredMaxSizeMb > 0
    ? configuredMaxSizeMb
    : defaultMaxSizeMb;
const maxSize = maxSizeMb * 1024 * 1024;
const maxSizeMessage = `File size must not exceed ${maxSizeMb}MB`;

export const documentsUploadSchema = z.object({
    poi: z
        .instanceof(File, { message: "Please upload a valid file" })
        .refine((file) => file && fileTypes.includes(file.type), {
            message: "Only JPEG, PNG, JPG and PDF are allowed"
        })
        .refine((file) => file && file.size <= maxSize, {
            message: maxSizeMessage
        }),

    poa: z
        .instanceof(File, { message: "Please upload a valid file" })
        .refine((file) => file && fileTypes.includes(file.type), {
            message: "Only JPEG, PNG, JPG and PDF are allowed"
        })
        .refine((file) => file && file.size <= maxSize, {
            message: maxSizeMessage
        }),

    extraDocs: z
        .array(z.instanceof(File))
        .optional()
        .refine(
            (files) =>
                !files ||
                files.every((file) => fileTypes.includes(file.type)),
            { message: "Only JPEG, PNG, JPG and PDF are allowed" }
        )
        .refine(
            (files) =>
                !files ||
                files.every((file) => file.size <= maxSize),
            { message: `Each file must not exceed ${maxSizeMb}MB` }
        ),
});
