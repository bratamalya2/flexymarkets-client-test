import * as z from 'zod';

export const updateProfileSchema = z.object({
    fullName: z.string().min(1, "Please type your name").min(3, "Name must be at least 3 characters long").or(z.literal("")),
    email: z.string().email("Please type a valid email").min(2, "Please type your bank name").or(z.literal("")),
    country: z.string().trim().min(1, "Please select your country").or(z.literal("")),
    mobile: z.string().regex(/^[0-9]{10,15}$/, "Please enter a valid mobile number").or(z.literal(""))
});