"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Ellipsis } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CompagneData = {
    id: string;
    Nom: string;
    Societe: string;
    Script: string;
};

export const CompagneColumns: ColumnDef<CompagneData>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "Nom",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nom
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "Societe",
        header: "Societe",
    },
    {
        accessorKey: "Script",
        header: "Script",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Ellipsis className="" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Dialog>
                                <DialogTrigger className="w-full bg-blue text-blanc hover:bg-blue/90 hover:text-blanc duration-500 rounded-lg p-1">
                                    Editer
                                </DialogTrigger>
                                <DialogContent className="bg-blanc">
                                    <DialogHeader>
                                        <DialogTitle className="text-blue text-2xl mb-1 ml-[15%]">Editer une compagner</DialogTitle>
                                        <DialogDescription>
                                            <form className="w-full max-w-xs mx-auto">
                                                <div className="mb-6">
                                                    {/* Vous pouvez ajouter des éléments ici si nécessaire */}
                                                </div>
                                                <div className="mb-6">
                                                    <textarea
                                                        className="shadow appearance-none border rounded-[10px] border-blue w-full py-2 px-3 text-blue mb-3 leading-tight focus:outline-none focus:shadow-outline placeholder-blue/70 caret-blue"
                                                        placeholder="Commentaire"
                                                    ></textarea>
                                                </div>
                                                <div className="flex items-center">
                                                    <button
                                                        className="bg-blue hover:bg-blue/80 text-white font-bold py-2 px-4 rounded-[10px] w-full focus:outline-none focus:shadow-outline"
                                                        type="button"
                                                    >
                                                        Enregistrer
                                                    </button>
                                                </div>
                                            </form>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Dialog>
                                <DialogTrigger className="w-full bg-red-500 text-blanc hover:bg-red-500/90 hover:text-blanc duration-500 rounded-lg p-1">
                                    Suprimer
                                </DialogTrigger>
                                <DialogContent className="bg-blanc">
                                    <DialogHeader>
                                        <DialogTitle className="text-blue text-2xl mb-1 ml-[15%]">Suprimer une compagner</DialogTitle>
                                        <DialogDescription>
                                            <form className="w-full max-w-xs mx-auto">
                                                <h1>vous voulez vraiment supprimer .</h1>
                                                <div className="flex items-center">
                                                    <button
                                                        className="bg-blue hover:bg-blue/80 text-white font-bold py-2 px-4 rounded-[10px] w-full focus:outline-none focus:shadow-outline"
                                                        type="button"
                                                    >
                                                        Enregistrer
                                                    </button>
                                                </div>
                                            </form>
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>


            </div>
        )
    },
]
