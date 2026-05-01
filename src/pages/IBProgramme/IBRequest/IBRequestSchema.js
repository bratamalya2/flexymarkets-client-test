// schemas/userSchema.js
import * as z from 'zod';

/**
 * Helpers
 */
const emptyToUndefined = (schema) =>
  z.preprocess((val) => (val === "" ? undefined : val), schema);

const stringToNumber = (opts = {}) =>
  z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    if (typeof val === "number") return val;
    const n = Number(String(val).trim());
    return Number.isFinite(n) ? n : val;
  }, z.number().refine((v) => (opts.allowNegative ? true : v >= 0), { message: "Must be a non-negative number" }));

const stringToBoolean = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val === 1;
  if (typeof val === "string") {
    const s = val.trim().toLowerCase();
    if (s === "true" || s === "1") return true;
    if (s === "false" || s === "0") return false;
  }
  return val;
}, z.boolean());

const stringToDate = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  if (val instanceof Date) return val;
  const parsed = Date.parse(String(val));
  return Number.isNaN(parsed) ? val : new Date(parsed);
}, z.date());

/**
 * Schema
 */
export const IBRequestSchema = z.object({
  user: emptyToUndefined(z.string()),
  firstName: emptyToUndefined(z.string().min(1, "First name required")),
  lastName: emptyToUndefined(z.string()),
  primaryEmail: emptyToUndefined(z.string().email("Invalid primary email")),
  ccountryName: emptyToUndefined(z.string()),
  email: emptyToUndefined(z.string().email("Invalid email")),
  secondryEmail: emptyToUndefined(z.string().email("Invalid secondary email")),
  countryCode: emptyToUndefined(z.string().min(1, "Country code required")),
  mobile: emptyToUndefined(z.string().min(4, "Invalid mobile number")),
  gender: emptyToUndefined(z.enum(["male", "female", "other"]).optional()),
  assingTo: emptyToUndefined(z.string()),
  dob: stringToDate.optional(),
  walletId: emptyToUndefined(z.string()),
  nationality: emptyToUndefined(z.string()),
  leadSource: emptyToUndefined(z.string()),
  ftd: stringToDate.optional(),
  kycStatus: emptyToUndefined(z.string()),
  isConvertedFromLead: stringToBoolean.optional(),
  loginVerified: stringToBoolean.optional(),
  createdTime: stringToDate.optional(),
  modifiedTime: stringToDate.optional(),
  source: emptyToUndefined(z.string()),
  isAgree: stringToBoolean.optional(),
  referenceId: emptyToUndefined(z.string()),
  whereDidYouFindUs: emptyToUndefined(z.string()),
  withdrawAllowed: stringToBoolean.optional(),
  lastLoginIp: emptyToUndefined(z.string().refine(v => !v || /^(\d{1,3}\.){3}\d{1,3}$/.test(v) || /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/.test(v), { message: "Invalid IP format" })),
  kycFormEdit: stringToBoolean.optional(),
  plainPassword: emptyToUndefined(z.string().min(6, "Password must be at least 6 characters").optional()),
  entity: emptyToUndefined(z.string()),

  // IB (introducer / affiliate) related
  ibName: emptyToUndefined(z.string()),
  yearsOfExp: stringToNumber({ allowNegative: false }).optional(),
  noOfExistingClient: stringToNumber({ allowNegative: false }).optional(),
  averageVolumePerMonth: stringToNumber({ allowNegative: false }).optional(),
  ibStatus: emptyToUndefined(z.string()),
  rejectedReason: emptyToUndefined(z.string()),
  childProfile: emptyToUndefined(z.string()),
  parentAffliateCode: emptyToUndefined(z.string()),
  ibLevel: emptyToUndefined(z.string()),
  ibHierarchy: emptyToUndefined(z.string()),
  parentProfile: emptyToUndefined(z.string()),
  ibNode: emptyToUndefined(z.string()),
  distributMaxComission: stringToNumber({ allowNegative: false }).optional(),
  maxIbCommAmtPerLot: stringToNumber({ allowNegative: false }).optional(),
  preferableAssignedUserId: emptyToUndefined(z.string()),
  comissionPercentage: stringToNumber({ allowNegative: false }).optional(),

  // portal / preferences
  portalUser: stringToBoolean.optional(),
  language: emptyToUndefined(z.string()),
  timeZone: emptyToUndefined(z.string()),
  timeFormate: emptyToUndefined(z.string()),
  dateFormate: emptyToUndefined(z.string()),
  isSetPreference: stringToBoolean.optional(),

  // mailing / address
  maillingStreet: emptyToUndefined(z.string()),
  maillingCity: emptyToUndefined(z.string()),
  maillingState: emptyToUndefined(z.string()),
  maillingZip: emptyToUndefined(z.string()),
  maillingPoBox: emptyToUndefined(z.string()),
  maillingCountry: emptyToUndefined(z.string()),

  profileImage: emptyToUndefined(z.string()), // could be URL — add z.string().url() if needed
  isDeleted: stringToBoolean.optional(),
}).partial(); // .partial() because original JSON uses empty strings — treat fields as optional
