"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Data type definition
export type QuickLivraisonCommerce = {
    id: string;
    Nom: string;
    Telephone: number;
    Arecuperation: string;
    Adresse_livraison: string;
    Nombre_de_Voyages: string;
    Description_du_Contenu: string;
    Date_livraison: string;
};

// Example variable to track the delivery note number (this should be dynamic)
let bonDeLivraisonNumber = 1; // You might want to implement a more persistent mechanism for this.

export const QuickcolumnsCommerce: ColumnDef<QuickLivraisonCommerce>[] = [
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
            );
        },
    },
    {
        accessorKey: "Telephone",
        header: "Téléphone",
    },
    {
        accessorKey: "Arecuperation",
        header: "Adresse de récupération",
    },
    {
        accessorKey: "Adresse_livraison",
        header: "Adresse de Livraison",
    },
    {
        accessorKey: "Description_du_Contenu",
        header: "Description du Contenu",
    },
    {
        accessorKey: "Nombre_de_Voyages",
        header: "Nombre de Voyages",
    },
    {
        accessorKey: "Date_livraison",
        header: "Date",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    onClick={() => handlePrint(row.original)}
                >
                    <Printer className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];

// Print function
const handlePrint = (data: QuickLivraisonCommerce) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
        printWindow.document.write(`
        <html>
            <head>
                <title>Imprimer Bon de Livraison</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        padding: 20px; 
                        margin: 0; 
                        position: relative; 
                        min-height: 100vh; 
                    }
                    h1 { text-align: center; font-size: 1.5em; }
                    .container { width: 80%; margin: auto; }
                    .section { margin-bottom: 20px; }
                    .section span { font-weight: bold; }
                    .header-section, .footer-section { 
                        text-align: center; 
                        margin-bottom: 20px; 
                        font-size: 0.9em; 
                    }
                    .signature { 
                        margin-top: 50px; 
                        text-align: left; 
                    }
                    .underline { 
                        border-bottom: 1px solid black; 
                        display: inline-block; 
                        width: 200px; 
                    }
                    .flex {
                        display:flex;
                        justify-content:space-between;
                    }
                    .mt-30 {
                        margin-top:10px;
                    }
                    .footer-section {
                        position: absolute; 
                        bottom: 150px; /* Adjust to ensure it is above the bottom edge */
                        left: 0; 
                        right: 0; 
                    }
                </style>
            </head>
            <body>
                <div class="header-section flex">
                    <div>
                        <p>
                            MINISTERE DE LA COMMUNICATION <br />
                            CHARGE DES POSTES <br />
                            ET DES TELECOMMUNICATIONS
                        </p>
                        <p>
                            LA POSTE DE DJIBOUTI S.A <br />
                            DIRECTION GENERALE <br />
                            Djibouti le ${new Date().toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <img src="${window.location.origin}/logo.png" alt="logo du poste" style="width: 150px; height: auto;" />
                    </div>
                </div>

                <h1>Formulaire de Livraison</h1>
                <div class="container">
                    <div class="section">
                        <span>Numéro de Bon de livraison:</span> ${data.id}
                    </div>
                    <div class="section">
                        <span>Adresse de Collecte:</span> ${data.Arecuperation}
                    </div>
                    <div class="section">
                        <span>Adresse de Livraison:</span> ${data.Adresse_livraison}
                    </div>
                    <div class="section">
                        <span>Nom:</span> ${data.Nom}
                    </div>
                    <div class="section">
                        <span>Téléphone:</span> ${data.Telephone}
                    </div>
                    <div class="section">
                        <span>Description du Contenu:</span> ${data.Description_du_Contenu}
                    </div>
                    <div class="section">
                        <span>Nombre de Voyages:</span> ${data.Nombre_de_Voyages}
                    </div>
                    <div class="section">
                        <span>Date de Livraison:</span> ${data.Date_livraison}
                    </div>
                    <div class="signature">
                        <span>Signature:</span> <span class="underline"></span>
                    </div>
                </div>

                <div class="footer-section mt-30">
                    <p>
                        REPUBLIQUE DE DJIBOUTI <br />
                        Unité – Egalité – Paix
                    </p>
                    <p>
                        SIEGE SOCIAL – Bd de la République – BP 557 – République de Djibouti <br />
                        Tél: (253) 21 35 72 73 – Fax: (253) 21 35 78 78 – E-mail: postdir@intnet.dj
                    </p>
                    <p>
                        CENTRE- EINGUELA – MARABOUT – NASSER – BALBALA – ARTA – ALI-SABIEH – DIKHIL – TADJOURAH – OBOCK
                    </p>
                </div>
            </body>
        </html>
        `);
        printWindow.document.close();
        printWindow.print();
    } else {
        console.error("Unable to open print window.");
    }
};

