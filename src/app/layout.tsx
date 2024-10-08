import type { Metadata } from "next";

import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";

import { Inter } from "next/font/google";
// import { Amplify } from "aws-amplify";
// import config from "../amplifyconfiguration.json";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TODO-fy",
  description: "A project management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Amplify.configure(config);
  // console.log("ran config");

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
