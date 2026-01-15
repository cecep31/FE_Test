"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  DoorOpen,
  FileText,
  ChevronRight,
} from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Master Gerbang",
    href: "/dashboard/master-gerbang",
    icon: DoorOpen,
  },
  {
    title: "Laporan Latin",
    icon: FileText,
    items: [
      {
        title: "Laporan Per Hari",
        href: "/dashboard/laporan-latin/per-hari",
      },
    ],
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="h-14 p-4">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/next.svg"
            alt="App Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="text-lg font-semibold group-data-[state=collapsed]:hidden">
            Nextjs
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) =>
                item.items ? (
                  <Collapsible.Root asChild key={item.title}>
                    <SidebarMenuItem>
                      <Collapsible.Trigger asChild>
                        <SidebarMenuButton
                          className="w-full justify-between"
                          data-active={item.items.some((subItem) =>
                            isActive(subItem.href)
                          )}
                          tooltip={item.title}
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                        </SidebarMenuButton>
                      </Collapsible.Trigger>
                      <Collapsible.Content asChild>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive(subItem.href)}
                              >
                                <Link href={subItem.href}>
                                  {subItem.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </Collapsible.Content>
                    </SidebarMenuItem>
                  </Collapsible.Root>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href!)}
                      tooltip={item.title}
                    >
                      <Link href={item.href!}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
