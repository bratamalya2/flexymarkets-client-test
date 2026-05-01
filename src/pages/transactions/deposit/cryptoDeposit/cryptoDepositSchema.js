import { z } from 'zod';

export const cryptoDepositSchema = z.object({
    network: z.string().min(1, 'Please select your network type'),
    // mt5Account: z.string().min(1, 'Please select your mt5 account'),
    amount: z.coerce.number().positive('Amount must be greater than 0')
});
