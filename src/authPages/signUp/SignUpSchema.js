import * as z from 'zod';

const emptyToUndefined = (schema) =>
    z.preprocess((val) => (val === "" || val === null ? undefined : val), schema.optional());

export const signUpSchema = z.object({
    email: z.string().trim().email("Please type a valid email").min(1, "User name or email is required"),
    country: z.string().trim().min(1, "Please select your country"),
    referralCode: emptyToUndefined(z.string().trim().or(z.literal("")).optional()),
    isMarketing: z.string().optional(),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(15, "Password must be at most 15 characters")
        .regex(/[a-z]/, "Must include at least one lowercase letter")
        .regex(/[A-Z]/, "Must include at least one uppercase letter")
        .regex(/\d/, "Must include at least one number")
        .regex(/[^a-zA-Z0-9]/, "Must include at least one special character")
}).transform((obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
});