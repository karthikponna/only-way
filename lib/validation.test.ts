import { describe, expect, it } from "vitest";

import { careerDraftSchema } from "@/lib/validation";

describe("cold email draft validation", () => {
  it("rejects oversized email content", () => {
    const result = careerDraftSchema.safeParse({
      username: "octocat",
      fullName: "Octocat",
      targetCompany: "",
      emailSubject: "Hello",
      emailBody: "x".repeat(6_001),
    });

    expect(result.success).toBe(false);
  });
});
