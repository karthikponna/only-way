import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RepoReady — GitHub to Cold Email",
    template: "%s — RepoReady",
  },
  description:
    "Turn a public GitHub profile into an editable cold email rendered with Unlayer Elements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
