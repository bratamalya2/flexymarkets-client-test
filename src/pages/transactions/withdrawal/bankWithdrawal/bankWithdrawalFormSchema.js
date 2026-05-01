import * as z from "zod";

const emptyToUndefined = (schema) =>
  z.preprocess((val) => (val === "" ? undefined : val), schema);

export const getWithdrawalSchema = ({
  securityMethod,
  isAmountAndRemarkSubmittedParam,
}) => {
  if (securityMethod === "GOOGLE-AUTH") {
    return z.object({
      amount: z.string().min(1, "Amount is required"),
      remark: z.string().min(3, "Remark must be at least 3 characters"),
      code: z.string().min(6, "Google Auth code must be at least 6 digits"),
    });
  }

  if (!isAmountAndRemarkSubmittedParam) {
    return z.object({
      amount: z.string().min(1, "Amount is required"),
      remark: z.string().min(3, "Remark must be at least 3 characters"),
      code: emptyToUndefined(z.string().optional()),
    });
  }

  return z.object({
    code: z.string().min(6, "Verification code must be at least 6 digits"),
  });
};
