import * as z from 'zod';

export const openAccountFormSchema = z.object({
    groupId: z.number().min(1, "Group id is required"),
    // group: z.string().trim().min(1, "Group is required"),
    Leverage: z.number().min(1, "Leverage is required"),
    // currency: z.string().trim().min(1, "Please select your currency type"),
    PassMain: z.string()
        .min(8, "Main password must be at least 8 characters")
        .refine(
            (value) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(value),
            {
                message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
            }
        ),
    // PassInvestor: z.string()
    //     .min(8, "Investor password must be at least 8 characters")
    //     .refine(
    //         (value) => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(value),
    //         {
    //             message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)",
    //         }
    //     )
});