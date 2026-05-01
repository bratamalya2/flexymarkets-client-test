import * as z from 'zod';

export const newTicketSchema = z.object({
    subject: z.string().min(1, "Please type your subject").min(3, "Subject must be at least 3 characters long"),
    priority: z.string().min(2, "Please select your priority level"),
    message: z.string().trim().min(1, "Please type your message").min(3,"Message must be at least 3 characters long")
});