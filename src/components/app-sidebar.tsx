'use client'

import React from "react"
import { LayoutContext } from "@/context/layout.context";
import { useContext } from "react"

import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  ExternalLink,
  GithubIcon,
  LinkedinIcon,
  LogOut,
  Sparkles,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarFooter
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
      {/* <SidebarHeader className="h-[64px] bg-background">
        <div className="p-4 text-lg font-medium flex items-center gap-2">
        </div>

      </SidebarHeader> */}
      <SidebarContent >
        <SidebarMenu>
          {/* {projects.map((project) => (
            <SidebarMenuItem key={project.name}>
              <SidebarMenuButton asChild>
                <a href={project.url}>
                  <project.icon />
                  <span>{project.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))} */}
        </SidebarMenu>

        {/* {Array.from({ length: 5 }).map((_, index) => (
    <SidebarMenuItem key={index}>
      <SidebarMenuSkeleton />
    </SidebarMenuItem>
  ))} */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton
          size="lg"
          className="flex-col cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-[200px] items-start bg-transparent hover:bg-transparent focus:bg-transparent border-2 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950"
        >



          <div className="flex w-full items-start bg-transparent hover:bg-transparent focus:bg-transparent">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={"https://m.media-amazon.com/images/M/MV5BNDExOTYzZjEtMjQxYy00OGIxLTg4YmMtMjZhMGY1YTY2NDc0XkEyXkFqcGc@._V1_.jpg"} alt={"Drew Stephenson"} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center justify-center text-sm h-full ml-2 w-full">

              <div className="flex flex-col">
                <span className="truncate font-medium">{"Drew Stephenson"}</span>
                <span className="truncate font-medium">{"Software Engineer"}</span>

              </div>

              {/* <div className="flex-2 mt-2 h-full flex items-center justify-center rounded-lg p-1 text-xs">
                 View Portfolio Site <ExternalLink className="ml-1 size-3" />
                </div> */}
            </div>
          </div>

          {/* <div className="flex-2 w-full mt-2 h-full flex items-center justify-center rounded-lg p-1 text-xs">
                 View <ExternalLink className="ml-1 size-3" />
                </div> */}
          {/* <ChevronsUpDown className="ml-auto size-4" /> */}
        </SidebarMenuButton>
        {/* <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          Portfolio

          <ChevronRight className="ml-auto size-4" />
        </SidebarMenuButton> */}
        <SidebarMenuButton asChild>
          <a href={"https://www.linkedin.com/in/andrew-tech-stephenson/"}>
            <GithubIcon />
            <span>Github</span>
            <ChevronRight className="ml-auto size-4" />
          </a>
        </SidebarMenuButton>
        <SidebarMenuButton asChild>
          <a href={"https://www.linkedin.com/in/andrew-tech-stephenson/"}>
            <LinkedinIcon />
            <span>Linkedin</span>
            <ChevronRight className="ml-auto size-4" />
          </a>

        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
