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

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    typeName: string
}

export function DataTableImportation<TData, TValue>({
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
                <select name="campagne" id="campagne" className="relative outline-none border border-blue rounded-lg px-4 w-max py-2 flex-1 cursor-pointer">
                    <option value="Recouvrement">Recouvrement</option>
                    <option value="E-suuq">E-suuq</option>
                    <option value="Colis-Ems">Colis EMS</option>
                    <option value="petit_paquet">Petit Paquet</option>
                </select>
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
                                    className="border-b border-blue text-blue"
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
            </div>
        </>
    )
}
