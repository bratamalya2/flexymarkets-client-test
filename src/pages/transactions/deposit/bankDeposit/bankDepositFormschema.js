import * as z from 'zod';

export const bankDepositFormschema = z.object({
    transactionReference: z.string().min(1, "Please type transaction Reference").min(3, "Transaction Reference must be at least 3 characters long"),
    amount: z.string().min(2, "Please type your deposit amount"),
    remark: z.string().trim().min(1, "Please type your remark").min(3, "Remark must be at least 3 characters long"),
    image: z
        .instanceof(File, { message: "Please upload a valid image file" })
        .refine(
            (file) => file && ["image/jpeg", "image/png"].includes(file.type),
            { message: "Only JPEG or PNG images are allowed" }
        )
        .refine(
            (file) => file && file.size <= 5 * 1024 * 1024,
            { message: "Image size must not exceed 5MB" }
        )
});