import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhiteHats | Elite Cybersecurity Club",
  description: "Official portal of WhiteHats Cybersecurity Club — CTFs, offensive security research, open-source intelligence, and high-impact operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-main text-white font-sans selection:bg-cyber-blue selection:text-black">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
