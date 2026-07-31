import { describe, expect, it } from "vitest";

import {
  buildCareerProfile,
  buildColdEmailBody,
  createCareerDraft,
} from "@/lib/career-profile";
import type { GitHubUser } from "@/lib/types";

const user: GitHubUser = {
  login: "octocat",
  name: "The Octocat",
  avatar_url: "https://avatars.githubusercontent.com/u/1",
  html_url: "https://github.com/octocat",
};

describe("cold email profile", () => {
  it("creates deterministic outreach defaults from a public profile", () => {
    const profile = buildCareerProfile(user);
    const draft = createCareerDraft(profile);

    expect(profile.fullName).toBe("The Octocat");
    expect(draft.emailSubject).toBe("Internship");
    expect(draft.emailBody).toContain("Hey, my name's The Octocat.");
    expect(draft.emailBody).toContain("Programming since 8th grade.");
  });

  it("targets the selected company in the internship email", () => {
    const email = buildColdEmailBody("The Octocat", "Snapchat");

    expect(email).toContain("Want to intern for Snapchat this summer");
  });
});
