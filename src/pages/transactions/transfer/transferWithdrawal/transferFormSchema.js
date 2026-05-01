import { z } from 'zod';

export const transferFormSchema = z.object({
    mt5Login: z.string().min(1, 'Please select at least one option'),
    to: z.string().min(1, 'Please select at least one option'),
    type: z.string(),
    amount: z.coerce.number().positive('Amount must be greater than 0')
});