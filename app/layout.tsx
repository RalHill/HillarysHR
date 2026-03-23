import type { Metadata } from "next";
import { Newsreader, Roboto } from "next/font/google";
import { generateOrganizationSchema } from "@/lib/schema";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Hillary's HR Blog - Canadian Employment Law & HR Intelligence",
  description:
    "Daily Canadian employment law and HR updates curated from 7+ sources. AI-summarized and annotated by Hillary.",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
    apple: "/favicon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Hillary's HR Blog",
    description:
      "Canadian employment law updates for HR professionals",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();

  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${roboto.variable}`}
      style={{ scrollBehavior: "smooth" }}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "var(--font-roboto)" }}>
        {children}
      </body>
    </html>
  );
}
