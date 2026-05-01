import { z } from "zod";

export const setIBCommissionSchema = z.object({
  planId: z.number({ required_error: "Plan is required" }).nullable().refine(
    (value) => value !== null,
    { message: "Plan is required" }
  ),
  level1Commission: z.string().min(1, "Level 1 Commission is required"),
  level2Commission: z.string().min(1, "Level 2 Commission is required"),
  level3Commission: z.string().min(1, "Level 3 Commission is required"),
  level4Commission: z.string().min(1, "Level 4 Commission is required"),
  level5Commission: z.string().min(1, "Level 5 Commission is required"),
  level6Commission: z.string().min(1, "Level 6 Commission is required"),
  level7Commission: z.string().min(1, "Level 7 Commission is required"),
})