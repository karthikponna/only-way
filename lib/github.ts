import "server-only";

import type { GitHubUser } from "@/lib/types";

const GITHUB_API = "https://api.github.com";
const USERNAME_PATTERN = /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i;

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

function headers(): HeadersInit {
  const result: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "OnlyWay-Cold-Email",
  };

  if (process.env.GITHUB_TOKEN) {
    result.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return result;
}

async function githubFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API}${path}`, {
    headers: headers(),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new GitHubApiError("That GitHub user could not be found.", 404);
    }

    if (response.status === 403 || response.status === 429) {
      throw new GitHubApiError(
        "GitHub's request limit was reached. Please try again shortly.",
        429,
      );
    }

    throw new GitHubApiError(
      "GitHub is unavailable right now. Please try again.",
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

export async function fetchGitHubData(username: string) {
  const normalized = username.trim().replace(/^@/, "");

  if (!USERNAME_PATTERN.test(normalized)) {
    throw new GitHubApiError("Enter a valid GitHub username.", 400);
  }

  const safeUsername = encodeURIComponent(normalized);
  return githubFetch<GitHubUser>(`/users/${safeUsername}`);
}
