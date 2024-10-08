import {
    ColumnDef,
    flexRender,
    SortingState,
    VisibilityState,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { SelectionCompagne } from "@/Schemas"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FileUp } from "lucide-react"
import { usePathname } from "next/navigation"
import * as XLSX from "xlsx"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

interface Agent {
    id: string;
    name: string;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    typeName: string;
    FetchData: (value: z.infer<typeof SelectionCompagne>) => void;
}

export function DataTableReaffect<TData, TValue>({
    columns,
    data,
    typeName,
    FetchData,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [pageSize, setPageSize] = useState(10)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedAgent, setSelectedAgent] = useState<string>("")
    const [selectedCompagne, setSelectedCompagne] = useState<string>("")
    const [agents, setAgents] = useState<Agent[]>([])
    const [selectCompagner, setSelectCompagner] = useState<any[]>([]) // Utiliser un type approprié si possible

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageSize,
                pageIndex: 0,
            },
        },
    })

    const path = usePathname()

    const exportToExcel = () => {
        const exportData = table.getRowModel().rows.map((row) =>
            row.getVisibleCells().reduce((acc, cell) => {
                acc[cell.column.id] = cell.getContext().getValue()
                return acc
            }, {} as { [key: string]: any })
        )

        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(exportData)
        XLSX.utils.book_append_sheet(wb, ws, "Status des appels")
        XLSX.writeFile(wb, "Status_des_appels.xlsx")
    }

    const fetchCompagner = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend/api.php?method=Compagnes`

        try {
            const response = await fetch(apiUrl)
            if (!response.ok) throw new Error("Erreur lors de la requête.")

            const responseData = await response.json()
            if (responseData.error) throw new Error("Erreur serveur: " + responseData.error)

            setSelectCompagner(responseData)
        } catch (error) {
            console.error("Erreur récupération des campagnes:", error)
        }
    }

    const fetchAgents = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend/api.php?method=AfficherPourSuperviseurTele`
        try {
            const response = await fetch(apiUrl)
            if (!response.ok) throw new Error("Erreur lors de l'exécution de la requête.")

            const responseData = await response.json()
            if (responseData.error) throw new Error("Erreur du serveur: " + responseData.error)

            setAgents(responseData)
        } catch (error) {
            console.error("Erreur lors de la récupération des agents:", error)
        }
    }

    const selcte = useForm<z.infer<typeof SelectionCompagne>>({
        resolver: zodResolver(SelectionCompagne),
        defaultValues: {
            Compagne: ""
        },
    })

    const handleChange = async (value: z.infer<typeof SelectionCompagne>) => {
        await FetchData(value)
    }

    // Fonction pour récupérer l'ID des lignes sélectionnées
    const getSelectedRowIds = () => {
        return table.getRowModel().rows
            .filter((row, index) => rowSelection[index]) // Vérifier la sélection avec l'indice
            .map((row) => row.original.id);
    }

    const handleReassign = async () => {
        const selectedRowIds = getSelectedRowIds();
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=Affectation`;
        try {

            const playload = {
                campagne: selectedCompagne,
                AgentsId: selectedAgent,
                ContactIds: selectedRowIds,
            }
            // Envoi de la requête POST avec les données du formulaire
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(playload),
            });

            // Vérification de la requête
            if (!response.ok) {
                console.error("Erreur lors de l'exécution de la requête.");
                return; // Arrêter l'exécution si la requête a échoué
            }

            const responseData = await response.json();

            if (responseData.error) {
                console.log(responseData.error);
            } else if (responseData.success) {
                console.log(responseData.success);
            }

        } catch (error) {
            console.error("Erreur :", error);
        }

        // Appeler une API ou gérer la logique de réaffectation ici avec selectedRowIds et selectedAgent
        // setIsDialogOpen(false);
    }


    useEffect(() => {
        fetchCompagner()
        fetchAgents()
    }, [])

    return (
        <>
            <div className="flex items-center gap-8 bg-blanc w-full h-max rounded-lg shadow-blue p-2">
                <Input
                    placeholder="Filter name..."
                    value={(table.getColumn(typeName)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(typeName)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm focus:ring-2 focus:ring-blue text-blue"
                />
                <Form {...selcte}>
                    <FormField
                        control={selcte.control}
                        name="Compagne"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Select
                                        {...field}
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                            handleChange(value)
                                            setSelectedCompagne(value) // Mettre à jour l'état de la campagne
                                        }}
                                    >
                                        <SelectTrigger className="shadow border border-blue rounded-[10px] w-full py-2 px-3 text-blue focus:outline-none placeholder-blue/70 caret-blue">
                                            <SelectValue placeholder="Sélectionner une campagne" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectCompagner.length > 0 ? (
                                                selectCompagner.map((item, index) => (
                                                    <SelectItem value={item.Nom} key={index}>
                                                        {item.Nom}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <p>Aucune campagne disponible</p>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </Form>
                {path === "/Superviseur/ReAffectation" && (
                    <>
                        {/* <button
                            className="text-white bg-blue hover:bg-blue/90 duration-300 p-2 w-max flex justify-center items-center space-x-2 rounded-lg"
                            onClick={exportToExcel}
                        >
                            <FileUp />
                            <span>Exportation</span>
                        </button> */}
                        <button
                            className="text-white bg-blue hover:bg-blue/90 duration-300 p-2 w-max flex justify-center items-center space-x-2 rounded-lg"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            <span>Réaffecter</span>
                        </button>
                    </>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="ml-auto bg-blue text-blanc hover:bg-blue/90">Colonnes</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {table.getAllColumns().map((column) => (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md bg-blanc w-full h-max shadow-blue mt-3">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b border-blue">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-b border-blue text-blue"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Aucun résultat.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {/* paginations */}
                <div className="flex items-center justify-end space-x-2 py-4 px-2">
                    {/* rows per page selector */}
                    <div className="flex items-center space-x-2">
                        <label htmlFor="rows-per-page" className="text-sm">
                            Rows per page:
                        </label>
                        <select
                            id="rows-per-page"
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="border rounded-md p-1"
                        >
                            {[10, 20, 30, 40, 500].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* show selected row  */}
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-blue">Réaffecter à un agent</DialogTitle>
                    </DialogHeader>
                    <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner un agent" />
                        </SelectTrigger>
                        <SelectContent className="text-blue">
                            {agents.map(agent => (
                                <SelectItem key={agent.id} value={agent.id}>
                                    {agent.Nom}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <DialogFooter>
                        <Button type="button" onClick={handleReassign} className="text-white bg-blue">Réaffecter</Button>
                        <Button type="button" onClick={() => setIsDialogOpen(false)} className="text-white bg-blue">Annuler</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
