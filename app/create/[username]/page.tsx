import type { Metadata } from "next";

import { CareerWorkspace } from "@/components/editor/career-workspace";

type PageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `Build @${username}'s cold email`,
    description: `Create an editable cold email from @${username}'s public GitHub profile.`,
  };
}

export default async function CreatePage({ params }: PageProps) {
  const { username } = await params;
  return <CareerWorkspace username={username} />;
}
