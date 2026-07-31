import { NextResponse } from "next/server";

import { buildCareerProfile } from "@/lib/career-profile";
import { fetchGitHubData, GitHubApiError } from "@/lib/github";

type RouteContext = {
  params: Promise<{ username: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { username } = await context.params;
    const user = await fetchGitHubData(username);
    const profile = buildCareerProfile(user);

    return NextResponse.json(profile, {
      headers: {
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("GitHub profile request failed", error);
    return NextResponse.json(
      { error: "We could not build that profile. Please try again." },
      { status: 500 },
    );
  }
}
