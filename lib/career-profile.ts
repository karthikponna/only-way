import type { CareerDraft, CareerProfile, GitHubUser } from "@/lib/types";

export function buildCareerProfile(user: GitHubUser): CareerProfile {
  return {
    username: user.login,
    fullName: user.name?.trim() || user.login,
    avatarUrl: user.avatar_url,
    githubUrl: user.html_url,
  };
}

export function buildColdEmailBody(
  fullName: string,
  targetCompany = "Cursor",
): string {
  return `Hey, my name's ${fullName}.

I understand your time is valuable. I'll only write three bullet points.

Programming since 8th grade.

Have most experience working in Java/Object C/Android/iOS.

Want to intern for ${targetCompany || "Cursor"} this summer as a high school junior. How ?

Thanks,
${fullName}`;
}

export function createCareerDraft(profile: CareerProfile): CareerDraft {
  return {
    username: profile.username,
    fullName: profile.fullName,
    targetCompany: "",
    emailSubject: "Internship",
    emailBody: buildColdEmailBody(profile.fullName),
  };
}
