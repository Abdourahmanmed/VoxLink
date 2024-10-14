"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useForm } from "react-hook-form"
import { SelectionCompagne } from "@/Schemas"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { FileUp } from "lucide-react"
import { usePathname } from "next/navigation"
import * as XLSX from "xlsx"; // Importer la librairie SheetJS

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    typeName: string
    FetchData: (value: z.infer<typeof SelectionCompagne>) => void
}

export function DataTableImportation<TData, TValue>({
    columns,
    data,
    typeName,
    FetchData,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [pageSize, setPageSize] = useState(10) // Nombre de lignes par page

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

    const [selectCompagner, setSelectCompagner] = useState([])

    const path = usePathname()

    // Fonction d'exportation des données en Excel
    const exportToExcel = () => {
        const exportData = table.getRowModel().rows.map((row) =>
            row.getVisibleCells().reduce((acc, cell) => {
                acc[cell.column.id] = cell.getContext().getValue()
                return acc
            }, {} as { [key: string]: any })
        )

        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.json_to_sheet(exportData)
        XLSX.utils.book_append_sheet(wb, ws, "Status des appelles")
        XLSX.writeFile(wb, "Status_des_appelles.xlsx")
    }

    // Fetch logic
    const fetchCompagner = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=Compagnes`

        try {
            const response = await fetch(apiUrl, { method: 'GET' })

            if (!response.ok) {
                console.error("Erreur lors de la requête.")
                return
            }

            const responseData = await response.json()

            if (responseData.error) {
                console.error("Erreur serveur:", responseData.error)
                return
            }

            setSelectCompagner(responseData)
        } catch (error) {
            console.error("Erreur récupération des campagnes:", error)
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

    useEffect(() => {
        fetchCompagner()
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
                            <FormItem className="w-1/2">
                                <FormControl>
                                    <Select
                                        {...field}
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                            handleChange(value)
                                        }}
                                    >
                                        <SelectTrigger className="shadow border border-blue rounded-[10px] w-full py-2 px-3 text-blue focus:outline-none placeholder-blue/70 caret-blue">
                                            <SelectValue placeholder="Sélectionner une compagne" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectCompagner && selectCompagner.length > 0 ? (
                                                selectCompagner.map((items, index) => (
                                                    <SelectItem value={items.Nom} key={index}>
                                                        {items.Nom}
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
                {(path && (path === "/Superviseur/status_des_appelles" || path === "/Superviseur/Rapport")) ? (
                    <div className=" flex gap-8 w-full">
                        <button
                            className="text-white bg-blue hover:bg-blue/90 duration-300 p-2 w-max flex justify-center items-center space-x-2 rounded-lg"
                            onClick={exportToExcel}
                        >
                            <FileUp className="" />
                            <span>Exportation</span>
                        </button>
                        <Input
                            placeholder="Filter Date..."
                            value={(table.getColumn("Date_appel")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("Date_appel")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm focus:ring-2 focus:ring-blue text-blue"
                        />
                        <Input
                            placeholder="Filter Agent..."
                            value={(table.getColumn("Agents")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("Agents")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm focus:ring-2 focus:ring-blue text-blue"
                        />
                    </div>
                ) : null}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="ml-auto bg-blue text-blanc hover:bg-blue/90 duration-500">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
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
                            {[10, 20, 30, 40, 50].map((size) => (
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
        </>
    )
}
