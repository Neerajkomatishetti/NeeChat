import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import NavbarRightColumn from "@/components/NavbarRightColumn";

export const metadata: Metadata = {
  title: "NeeChatV0",
  description:
    "A Chat application built with Next.js that provides llm interactivity and chat functionality for seamless AI experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased ">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <main className="flex relative flex-col w-full">{children}</main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
