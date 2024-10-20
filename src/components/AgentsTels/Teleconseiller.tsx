"use client";
import Sidebar from "../Sidebar";
import { ShoppingBag, Box, DollarSign, Truck, BellPlus, PackageCheck, Mails, ClipboardPen, HousePlug, ConciergeBell } from 'lucide-react';
import Maincontent from "../Maincontent";
import { usePathname } from "next/navigation";
import Content from "./Content";

// Menu items, including icons and submenus
const Menu = [
    { title: "E-suuq", icon: <ShoppingBag />, link: "/Teleconseiller/E-suuq" },
    { title: "Colis-Ems", icon: <Mails />, link: "/Teleconseiller/Colis-Ems" },
    { title: "Petite paquet", icon: <Box />, link: "/Teleconseiller/Petite_paquet" },
    { title: "Cartin", icon: <PackageCheck />, link: "/Teleconseiller/Cartin" },
    { title: "E-suuq Prospection", icon: <HousePlug />, link: "/Teleconseiller/E-suuq_Prospection"},
    { title: "Maison citoyens", icon: <HousePlug />, link: "/Teleconseiller/Maison_Du_citoyens"},
    {
        title: "Recouvrement", icon: <DollarSign />, Submenu: [
            { title: "Retard paiement", link: "/Teleconseiller/Recouvrement/Retard_paiement" },
            { title: "Redevance de l'annee", link: "/Teleconseiller/Recouvrement/Redevance_annee" },
            { title: "Nouveau Abonnee", link: "/Teleconseiller/Recouvrement/Nouveau_Abonne" },
        ]
    },
    { title: "Demande livraison", icon: <Truck />, link: "/Teleconseiller/Demande_livraison" },
    { title: "Quick poste", icon: <ClipboardPen />, link: "/Teleconseiller/Quick_poste" },
    { title: "Bonne reception de la facture BP", icon: <ConciergeBell />, link: "/Teleconseiller/Bonne_reception_de_la_facture_BP" },
    {
        title: "Status des appels", icon: <BellPlus />, Submenu: [
            { title: "Repondu", link: "/Teleconseiller/Status_des_appels/Repondu" },
            { title: "Rappeller", link: "/Teleconseiller/Status_des_appels/Rappeller" },
            { title: "Indisponible", link: "/Teleconseiller/Status_des_appels/Indisponible" },
            { title: "Abouti", link: "/Teleconseiller/Status_des_appels/Abouti" },
            { title: "Tous les Rappels", link: "/Teleconseiller/Status_des_appels/Tous_les_Rappels" },
            { title: "Tous les Indisponibles", link: "/Teleconseiller/Status_des_appels/Tous_les_Indisponibles" },
        ]
    },
];

export default function Teleconseiller() {
    const path = usePathname();

    return (
        <div className="flex">
            {/* Sidebar component with the menu */}
            <Sidebar menu={Menu} titre="Teleconseiller" />

            {/* Main content section */}
            <Maincontent>
                <h1 className="text-xl font-medium py-4 text-blue capitalize">
                    {path.replace(/^\/+/, '').replace(/_/g, ' ')}
                </h1>

                {/* Render content based on the current path */}
                {Menu.map((item) => (
                    item.link === path ? (
                        <Content key={item.link} title={item.title} />
                    ) : (
                        item.Submenu && item.Submenu.map((subItem) => (
                            subItem.link === path && <Content key={subItem.link} title={subItem.title} />
                        ))
                    )
                ))}
            </Maincontent>
        </div>
    );
}
