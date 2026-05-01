import { z } from 'zod';

export const metaDepositSchema = z.object({
    mt5Login: z.string().min(1, 'Please select your mt5 account'),
    type: z.string(),
    amount: z.coerce.number().positive('Amount must be greater than 0')
});