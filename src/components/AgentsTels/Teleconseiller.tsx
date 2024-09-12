"use client";
import Sidebar from "../Sidebar";
import { ShoppingBag, Package, Box, DollarSign, Truck, BellPlus } from 'lucide-react';
import Maincontent from "../Maincontent";
import { usePathname } from "next/navigation";
import Content from "./Content";

const Menu = [
    { title: "E-suuq", icon: <ShoppingBag />, link: "/Teleconseiller/E-suuq" },
    { title: "Colis-Ems", icon: <Package />, link: "/Teleconseiller/Colis-Ems" },
    { title: "Petite paquet", icon: <Box />, link: "/Teleconseiller/Petite_paquet" },
    { title: "Recouvrement", icon: <DollarSign />, link: "/Teleconseiller/Recouvrement" },
    { title: "Demande livraison", icon: <Truck />, link: "/Teleconseiller/Demande_livraison" },
    { title: "Rappel", icon: <BellPlus />, link: "/Teleconseiller/Rappels" },
];

export default function Telleconseiller() {
    const path = usePathname();
    return (
        <div className="flex">
            <Sidebar menu={Menu} titre="Teleconseiller" />
            <Maincontent>
                <h1 className="text-xl font-medium py-4 text-blue">{path.replace(/^\/+/, '')}</h1>
                {Menu.map((item) => (
                    path === item.link && <Content key={item.link} title={item.title} />
                ))}
            </Maincontent>
        </div>
    )
}