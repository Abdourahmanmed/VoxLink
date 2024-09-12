
import React from "react";
import Navbar from "./Navbar";
import { ScrollArea } from "@/components/ui/scroll-area"

interface child {
    children:React.ReactNode,
}

export default function Maincontent({children}:child) {
    return (
        <div className="w-full h-[90.7vh]">
            <Navbar />
            <ScrollArea className="w-full bg-gris h-full p-4">
                {children}
            </ScrollArea>
        </div>
    )
}