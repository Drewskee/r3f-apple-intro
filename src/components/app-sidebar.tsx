'use client'

import React from "react"
import { LayoutContext } from "@/context/layout.context";
import { useContext } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton
} from "@/components/ui/sidebar"
import { Settings2Icon } from "lucide-react"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sidebarRef } = useContext(LayoutContext)

  const projects = [
    {
      name: 'Project Alpha',
      url: '#',
      icon: Settings2Icon,
    },
    {
      name: 'Project Beta',
      url: '#',
      icon: Settings2Icon,
    },]

  return (
    <Sidebar ref={sidebarRef} {...props} variant="inset" collapsible="icon">
      <SidebarHeader className="bg-background">
        <div className="p-4 text-lg font-medium flex items-center gap-2">
        </div>

      </SidebarHeader>
      <SidebarContent className="bg-background">
        {/* We create a SidebarGroup for each parent. */}
        {/* {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))} */}
        <SidebarMenu>
  {projects.map((project) => (
    <SidebarMenuItem key={project.name}>
      <SidebarMenuButton asChild>
        <a href={project.url}>
          <project.icon />
          <span>{project.name}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))}
</SidebarMenu>

{/* {Array.from({ length: 5 }).map((_, index) => (
    <SidebarMenuItem key={index}>
      <SidebarMenuSkeleton />
    </SidebarMenuItem>
  ))} */}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
