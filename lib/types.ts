export type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
};

export type CareerProfile = {
  username: string;
  fullName: string;
  avatarUrl: string;
  githubUrl: string;
};

export type CareerDraft = {
  username: string;
  fullName: string;
  targetCompany: string;
  emailSubject: string;
  emailBody: string;
};

export type RenderedEmail = {
  emailHtml: string;
  emailText: string;
};
