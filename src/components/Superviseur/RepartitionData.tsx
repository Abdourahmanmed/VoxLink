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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FormSucces } from "../FormSucces";
import { FormError } from "../FormError";
import { UserX } from "lucide-react";

interface Agent {
    id: string;
    name: string;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    typeName: string;
}

export function DataTableRepartition<TData, TValue>({
    columns,
    data,
    typeName,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pageSize, setPageSize] = useState(10);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [pageIndex, setPageIndex] = useState(0); // Ajout de pageIndex dans l'état

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
                pageIndex, // Utilisation de pageIndex depuis l'état,
            },
        },
    });

    interface RowData {
        id: number;
    }

    const getSelectedRowIds = (): number[] => {
        return table.getRowModel().rows
            .filter((row) => row.getIsSelected())
            .map((row) => (row.original as RowData).id);
    };

    const handleDesaffectation = async () => {
        // Récupérer les IDs sélectionnés
        const selectedRowIds = getSelectedRowIds();

        // L'URL de l'API de désaffectation
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend/api.php?method=Desaffectation`;

        try {
            // Créer le payload à envoyer à l'API
            const payload = {
                ContactIds: selectedRowIds,
            };

            // Afficher les IDs sélectionnés (utile pour le debug)
            // alert(JSON.stringify(payload));

            // Envoyer la requête POST à l'API
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload), // Envoyer le payload en JSON
            });

            // Vérifier que la requête s'est bien passée
            if (!response.ok) {
                throw new Error("Erreur lors de l'exécution de la requête.");
            }

            // Extraire les données de la réponse
            const responseData = await response.json();

            // Gérer les différentes réponses de l'API
            if (responseData.error) {
                // Si l'API renvoie une erreur globale
                setErrorMessage(responseData.error);
            } else if (responseData.success) {
                // Si l'API indique que la désaffectation a réussi
                setSuccessMessage(responseData.success);
                console.log("Désaffectation réussie : ", responseData.success);
                setErrorMessage(undefined); // Réinitialiser le message d'erreur en cas de succès
            } else if (responseData.warning) {
                // Si l'API renvoie un avertissement (partiellement réussi)
                setSuccessMessage(responseData.warning);
                console.log("Avertissement : ", responseData.warning);
                setErrorMessage(undefined);
            }

        } catch (error) {
            // En cas d'erreur dans le processus
            console.error("Erreur :", error);
            setErrorMessage("Erreur lors de la désaffectation.");
        }
    };


    return (
        <>
            <div className="flex items-center gap-8 bg-white w-full h-max rounded-lg shadow p-2">
                <Input
                    placeholder="Filter By name contact..."
                    value={(table.getColumn(typeName)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(typeName)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm focus:ring-2 focus:ring-blue text-blue"
                />
                <Input
                    placeholder="Filter By Date affectation..."
                    value={(table.getColumn("Date_affectation")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("Date_affectation")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm focus:ring-2 focus:ring-blue text-blue"
                />
                <Input
                    placeholder="Filter By Compagne..."
                    value={(table.getColumn("Compagne")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("Compagne")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm focus:ring-2 focus:ring-blue text-blue"
                />
                <Input
                    placeholder="Filter By Status..."
                    value={(table.getColumn("qualification")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("qualification")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm focus:ring-2 focus:ring-blue text-blue"
                />
                <Button className="ml-auto bg-blue text-white" onClick={() => setIsDialogOpen(true)}>
                    Desaffectation
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="ml-auto bg-blue text-white">Colonnes</Button>
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

            <div className="rounded-md bg-white w-full h-max shadow mt-3">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="border-b">
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

                {/* Pagination and selected rows */}
                <div className="flex items-center justify-end space-x-2 py-4 px-2">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="rows-per-page" className="text-sm">Rows per page:</label>
                        <select
                            id="rows-per-page"
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="border rounded-md p-1"
                        >
                            {[10, 20, 30, 40, 50, 100].map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 text-sm">
                        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
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
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Desaffecter un agent</DialogTitle>
                    </DialogHeader>
                    <h1 className="text-xl font-medium flex gap-4 itmes-center"><UserX size={24} color="red" />Vous voulez vraiment deasaffecter ?</h1>
                    {successMessage && <FormSucces message={successMessage} />}
                    {errorMessage && <FormError message={errorMessage} />}
                    <DialogFooter>
                        <Button onClick={handleDesaffectation} className="bg-red-500 text-white px-8">
                            Oui
                        </Button>
                        <Button onClick={() => setIsDialogOpen(false)} className="bg-blue text-white">
                            Annuler
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
