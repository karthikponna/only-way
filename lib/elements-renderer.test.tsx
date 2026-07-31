import { describe, expect, it } from "vitest";

import { renderColdEmail } from "@/lib/elements-renderer";
import type { CareerDraft } from "@/lib/types";

const draft: CareerDraft = {
  username: "octocat",
  fullName: "Octocat",
  targetCompany: "Acme",
  emailSubject: "Internship",
  emailBody:
    "Hey, my name's Octocat.\n\nI build useful software.\n\nThanks,\nOctocat",
};

describe("Elements renderer", () => {
  it("renders email HTML and plain text with the subject", () => {
    const rendered = renderColdEmail(draft);

    expect(rendered.emailHtml).toContain("<!doctype html>");
    expect(rendered.emailHtml).toContain("Subject: Internship");
    expect(rendered.emailText).toContain("Subject: Internship");
    expect(rendered.emailText).toContain("Hey, my name's Octocat");
    expect(rendered.emailText).toContain("I build useful software");
  });

  it("escapes user-authored markup", () => {
    const rendered = renderColdEmail({
      ...draft,
      emailBody: "<script>alert(1)</script>",
    });

    expect(rendered.emailHtml).not.toContain("<script>alert(1)</script>");
    expect(rendered.emailHtml).toContain("&lt;script&gt;");
  });
});
