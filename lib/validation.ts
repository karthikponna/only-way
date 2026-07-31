import { z } from "zod";

const shortText = z.string().trim().max(160);
const longText = z.string().trim().max(6_000);

export const careerDraftSchema = z.object({
  username: z.string().trim().min(1).max(39),
  fullName: z.string().trim().min(1).max(120),
  targetCompany: shortText,
  emailSubject: z.string().trim().min(1).max(200),
  emailBody: longText.min(1),
});
