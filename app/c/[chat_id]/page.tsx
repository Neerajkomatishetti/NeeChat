"use client";

import Main from "@/components/main-app"
import { useParams } from "next/navigation"

export const chats = () => {
    const params = useParams<{chat_id:string}>()
    return <>
    <Main  chat_id={params.chat_id}/>
    </>
}

export default chats;