import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical } from 'lucide-react';


interface BoxInfo {
    title: string
    total: string
    color: string
}
export default function BoxInfoDetails({ title, total, color }: BoxInfo) {
    return (
        <div className="h-[100px] w-[300px] bg-blanc flex flex-col items-center shadow-blue">
            <div className="p-2 flex justify-between gap-4">
                <h1 className="text-blue text-md font-semibold">{title}</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger><EllipsisVertical className="text-blue h-[16px]"/></DropdownMenuTrigger>
                    <DropdownMenuContent className="text-blue">
                        <DropdownMenuLabel>Filtrage</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Par jour</DropdownMenuItem>
                        <DropdownMenuItem>Par semaine</DropdownMenuItem>
                        <DropdownMenuItem>Par mois</DropdownMenuItem>
                        <DropdownMenuItem>Par ans</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
            <div className="flex justify-center items-center p-2">
                <span className={`text-4xl text-${color}`}>{total}/j</span>
            </div>
        </div>
    )
}