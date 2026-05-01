import * as z from 'zod';

const emptyToUndefined = (schema) =>
    z.preprocess((val) => (val === "" || val === null ? undefined : val), schema.optional());

export const addBankSchema = z.object({
    holderName: z.string().min(1, "Please type account holder name").min(3, "Account holder name must be at least 3 characters long"),
    bankName: z.string().min(2, "Please type your bank name"),
    country: z.string().trim().min(1, "Please select your country"),
    accountNo: z.string()
        .min(1, "Please type your account number")
        .min(8, "Account number must be at least 8 characters")
        .max(17, "Invalid Account number")
        .regex(/^\d+$/, "Account number must contain only numbers"),
    ifscCode: z.string()
        .min(1, "Please type your IFSC code")
        .length(11, "IFSC code must be exactly 11 characters")
        .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
    ibanNo: emptyToUndefined(z.string()
        .min(15, "IBAN must be at least 15 characters")
        .max(34, "IBAN cannot exceed 34 characters")
        .regex(/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/, "Invalid IBAN format")),
    bankAddress: z.string().min(2, "Please type your bank address"),
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
}).transform((obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
});