"use client";

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

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as v4uuid } from "uuid";
import { getSidebarInfo } from "@/app/actions";

// Define a type for our chat objects for better type safety
interface Chat {
  id: string;
  title: string;
}

export function AppSidebar() {
  const [titles_And_Ids, setTitles_And_Ids] = useState<Chat[]>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch the list of chats
  const fetchTitlesAndIds = async () => {
    setIsLoading(true);
    const titles_And_Ids = await getSidebarInfo();
    setTitles_And_Ids(titles_And_Ids);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTitlesAndIds();
  }, []);

  const handleNewChat = async () => {
    const chat_id = v4uuid();
    const res = await fetch("/api/v1/c", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chat_id,
      }),
    });
    const data = await res.json();
    if (data.success) {
      // Re-fetch the chat list to include the new one
      await fetchTitlesAndIds();
      // Navigate to the new chat page
      router.push(`/c/${chat_id}`);
    } else {
      alert("Failed to create chat");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border border-b-border font-serif">
        NeeChat v0
      </SidebarHeader>
      <SidebarContent className="scrollbar-thin">
        <SidebarMenu>
          <SidebarMenuItem className="my-3">
            <SidebarMenuButton onClick={handleNewChat}>
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
                  {isLoading ? (
                    <p className="p-2">Loading...</p>
                  ) : (
                    titles_And_Ids.map((chat) => (
                      <SidebarMenuItem
                        key={chat.id}
                        className="hover:bg-sidebar-accent m-2 rounded-md"
                      >
                        <SidebarMenuButton
                          onClick={() => {
                            router.push(`/c/${chat.id}`);
                          }}
                        >
                          <span className="w-full overflow-x-hidden text-ellipsis">
                            {/* FIX: Use chat.title which is always available */}
                            {chat.title}
                          </span>
                        </SidebarMenuButton>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction showOnHover>
                              <MoreHorizontal />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" align="start">
                            <DropdownMenuItem>
                              <span>Rename</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    ))
                  )}
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
