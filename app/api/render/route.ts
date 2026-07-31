import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { renderColdEmail } from "@/lib/elements-renderer";
import { careerDraftSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 150_000) {
      return NextResponse.json(
        { error: "The email is too large to render." },
        { status: 413 },
      );
    }

    const draft = careerDraftSchema.parse(await request.json());
    const rendered = renderColdEmail(draft);

    return NextResponse.json(rendered, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Some fields need attention before this email can be rendered.",
          issues: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    console.error("Elements render failed", error);
    return NextResponse.json(
      { error: "The email could not be rendered." },
      { status: 500 },
    );
  }
}
