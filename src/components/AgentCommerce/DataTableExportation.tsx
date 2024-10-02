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

import { useState } from "react"
import { toast } from "react-toastify"
import { FileUp } from 'lucide-react';
import * as XLSX from "xlsx";  // Importer la librairie SheetJS

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    typeName: string
}

export function DataTableExportattion<TData, TValue>({
    columns,
    data,
    typeName,
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

    // Fonction d'exportation des données en Excel
    const exportToExcel = () => {
        // Récupérer les données visibles dans le tableau
        const exportData = table.getRowModel().rows.map((row) =>
            row.getVisibleCells().reduce((acc, cell) => {
                acc[cell.column.id] = cell.getContext().getValue(); // Accumule les données dans un objet
                return acc;
            }, {} as { [key: string]: any })
        );

        // Créer un nouveau classeur (workbook)
        const wb = XLSX.utils.book_new();

        // Convertir les données en feuille de calcul (worksheet)
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Ajouter la feuille au classeur
        XLSX.utils.book_append_sheet(wb, ws, "Status des appelles");

        // Exporter le fichier Excel
        XLSX.writeFile(wb, "Status_des_appelles.xlsx");
    };

    return (
        <>
            {/* column filter */}
            <div className="flex items-center gap-8  bg-blanc w-full h-max rounded-lg shadow-blue p-2">
                <Input
                    placeholder="Filter name..."
                    value={(table.getColumn(typeName)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(typeName)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm focus:ring-2 focus:ring-blue text-blue"
                />
                <button
                    className="text-white bg-blue hover:bg-blue/90 duration-300 p-2 w-max flex flex-1 justify-center items-center space-x-2 rounded-lg inline-block"
                    onClick={exportToExcel}  // Action d'exportation sur clic
                >
                    <FileUp className="" />
                    <span>Exportation</span>
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="ml-auto bg-blue text-blanc hover:bg-blue/90 hover:text-blanc duration-500">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {/* data table */}
            <div className="rounded-md bg-blanc w-full h-max rounded-lg shadow-blue mt-3">
                <Table>
                    <TableHeader >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b border-blue">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-b border-blue"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
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
