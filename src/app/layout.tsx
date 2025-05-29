import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import {
  LayoutDashboard,
  CalendarDays,
  ListChecks,
  Settings,
  Bot,
  Bell,
} from 'lucide-react';

import './globals.css';
import { AppLogo } from '@/components/icons';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TimeFlow Tracker',
  description: 'Track your daily tasks and manage your time effectively.',
};

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  // { href: '/tasks', label: 'All Tasks', icon: ListChecks }, // Example for future page
  // { href: '/settings', label: 'Settings', icon: Settings }, // Example for future page
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(geistSans.variable, geistMono.variable, 'antialiased')}>
        <SidebarProvider defaultOpen={true} >
          <Sidebar variant="sidebar" collapsible="icon" className="border-r">
            <SidebarHeader className="p-4 items-center flex justify-between">
              <Link href="/" className="flex items-center gap-2">
                <AppLogo className="w-7 h-7 text-primary" />
                <h1 className="text-xl font-semibold">TimeFlow</h1>
              </Link>
              {/* SidebarTrigger is available if needed, but we default to open */}
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      variant="default"
                      size="default"
                      tooltip={{ children: item.label, className: "ml-2"}}
                    >
                      <Link href={item.href} className="flex items-center">
                        <item.icon className="w-5 h-5 mr-2" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4">
              {/* Footer content if any, e.g. user profile, logout */}
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <main className="flex-1 p-6 bg-background min-h-screen">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
