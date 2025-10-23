import { Collapsible } from "@radix-ui/react-collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import historyData from '../history.json';

export function AppSidebar() {


  return (
    <Sidebar>
      <SidebarHeader className="border border-b-border font-serif">NeeChat v0</SidebarHeader>
      <SidebarContent className="scrollbar-thin">
        <SidebarMenu>
          <SidebarMenuItem className="my-3">
            <SidebarMenuButton>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              New Chat
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel className="w-full" asChild>
                <CollapsibleTrigger>
                  <p className="font-sans">Chats</p>
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  {historyData.chats.map(chat => (
                    <SidebarMenuItem
                      key={chat.id}
                      className="hover:bg-sidebar-accent m-2 rounded-md"
                    >
                      <SidebarMenuButton>
                        <span className="w-full overflow-x-hidden text-ellipsis">
                          {chat.messages[0].role === "user"? chat.messages[0].content:""}
                        </span>
                      </SidebarMenuButton>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            <MoreHorizontal/>
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem>
                            <span>Edit Project</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <span>Delete Project</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  ))}
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border border-t-border">Footer</SidebarFooter>
    </Sidebar>
  );
}
