// dto/aiUsage.dto.js
import { z } from "zod";

export const createAIUsageSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "El mes debe estar en formato YYYY-MM"),
  totalInteractions: z.number().int().min(0).default(0),
  tokensUsed: z.number().int().min(0).default(0),
  creditsUsed: z.number().min(0).default(0),
  monthlyLimit: z.number().int().min(0).default(100),
  remainingCredits: z.number().min(0).default(100),
  resetAt: z.string().datetime("resetAt debe ser una fecha válida")
});
