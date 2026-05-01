import * as z from 'zod';
import dayjs from 'dayjs';

export const personalInfoVerificationSchema = z.object({
    name: z.string().trim().min(1, "Please type your full name").min(3, "Full name must be at least 3 characters long"),
    // mobile: z.string().min(2, "Please type your mobile no."),
    // dob: z.string().min(1, "Please type your date of birth").nullable(),
    dob: z
        .custom((val) => dayjs(val).isValid(), { message: "Please select a valid date" })
        .refine(val => !!val, { message: "Date of birth is required" }),
    gender: z.string().min(1, "Please select your gender"),
    address: z.string().trim().min(1, "Please type your address").min(3, "Address must be at least 3 characters long")
});