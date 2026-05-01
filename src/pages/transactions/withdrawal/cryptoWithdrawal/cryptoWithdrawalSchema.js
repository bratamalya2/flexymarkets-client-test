import * as z from "zod";

const emptyToUndefined = (schema) =>
    z.preprocess((val) => (val === "" ? undefined : val), schema);

export const cryptoWithdrawalSchema = ({
    securityMethod,
    isAmountAndRemarkSubmittedParam
}) => {
    if (securityMethod === "GOOGLE-AUTH") {
        return z.object({
            network: z.string().min(1, 'Please select a network type'),
            walletAddress: z.string().min(1, 'Please type your wallet address'),
            amount: z.string().min(1, "Amount is required"),
            code: z.string().min(6, "Google Auth code must be at least 6 digits"),
        });
    }

    if (!isAmountAndRemarkSubmittedParam) {
        return z.object({
            network: z.string().min(1, 'Please select a network type'),
            walletAddress: z.string().min(1, 'Please type your wallet address'),
            amount: z.string().min(1, "Amount is required"),
            code: emptyToUndefined(z.string().optional()),
        });
    }

    return z.object({
        code: z.string().min(6, "Verification code must be at least 6 digits"),
    });
};
