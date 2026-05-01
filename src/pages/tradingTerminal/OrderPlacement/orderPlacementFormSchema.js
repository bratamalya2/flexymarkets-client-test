import * as z from 'zod';

const emptyToUndefined = (schema) =>
    z.preprocess((val) => (val === "" ? undefined : val), schema.optional());

export const orderPlacementFormSchema = z.object({
    // action: z.string().min(1),
    symbol: z.string().min(1),
    volume: z.string().min(1, "Volume should not be less than 0.01"),
    typeFill: z.string().min(1),
    type: z.string().min(1),
    priceOrder: emptyToUndefined(z.string().min(1, "Order price should not be empty")),
    // digits: z.string().min(1),
    login: z.string().min(1),
    priceSl: emptyToUndefined(z.string().min(1)),
    priceTp: emptyToUndefined(z.string().min(1))
}).transform((obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
});