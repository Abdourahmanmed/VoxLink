"use client";

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
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { usePathname } from "next/navigation";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    typeName: string;
}

export function QuickPostData<TData, TValue>({
    columns,
    data,
    typeName,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pageSize, setPageSize] = useState(10); // Nombre de lignes par page
    const [pageIndex, setPageIndex] = useState(0); // Ajout de pageIndex dans l'état
    const path = usePathname();

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
                pageIndex, // Utilisation de pageIndex depuis l'état
            },
        },
    });

    return (
        <>
            {/* column filter */}
            <div className="flex items-center py-4 gap-8">
                <Input
                    placeholder="Filter name contact..."
                    value={(table.getColumn(typeName)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(typeName)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm focus:ring-2 focus:ring-blue text-blue"
                />
                {path &&
                    ["/Teleconseiller/Status_des_appels/Repondu",
                        "/Teleconseiller/Status_des_appels/Tous_les_Indisponibles",
                        "/Teleconseiller/Status_des_appels/Tous_les_Rappels"].includes(path) && (
                        <>
                            <Input
                                placeholder="Filter By Compagne..."
                                value={(table.getColumn("Compagne")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("Compagne")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm focus:ring-2 focus:ring-blue text-blue"
                            />
                            <Input
                                placeholder="Filter By Date appel..."
                                value={(table.getColumn("Date_appel")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("Date_appel")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm focus:ring-2 focus:ring-blue text-blue"
                            />
                        </>
                    )}

                {path &&
                    ["/Commercial/Quick_Poste", "/Superviseur/QuicPoste"].includes(path) && (
                        <Input
                            placeholder="Filter Date livraison..."
                            value={(table.getColumn("Date_livraison")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("Date_livraison")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm focus:ring-2 focus:ring-blue text-blue"
                        />
                    )}
                <Input
                    placeholder="Filter By Agents..."
                    value={(table.getColumn("Agents")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("Agents")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm focus:ring-2 focus:ring-blue text-blue"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="ml-auto bg-blue text-white hover:bg-blue/90 hover:text-white duration-500">
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
                                    onCheckedChange={(value) =>
                                        column.toggleVisibility(!!value)
                                    }
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            {/* data table */}
            <div className="rounded-md border border-blue">
                <Table>
                    <TableHeader className="border border-blue">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="border border-blue">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="border border-blue">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="border border-blue">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
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
            {/* paginations */}
            <div className="flex items-center justify-end space-x-2 py-4">
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
                        {[10, 20, 30, 40, 50, 100, 500, 1000].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
                {/* show selected row */}
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setPageIndex((prev) => Math.max(prev - 1, 0));
                        table.previousPage();
                    }}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setPageIndex((prev) => prev + 1);
                        table.nextPage();
                    }}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </>
    );
}
