"use client";
import Sidebar from "../Sidebar";
import { LayoutDashboard ,  Truck,  Users , } from 'lucide-react';
import Maincontent from "../Maincontent";
import { usePathname } from "next/navigation";
import ContentCommerce from "./ContentCommerce";

const Menu = [
    { title: "Importation", icon: <LayoutDashboard  />, link: "/Commercial/importation" },
    { title: "Exportation", icon: < Users  />, link: "/Commercial/Exportation" },
    { title: "Demande livraison", icon: < Truck  />, link: "/Commercial/Demande_livraison" },
   
];

export default function ACommerce() {
    const path = usePathname();
    return (
        <div className="flex">
            <Sidebar menu={Menu} titre="Commercial" />
            <Maincontent>
                <h1 className="text-xl font-medium py-4 text-blue">{path.replace(/^\/+/, '')}</h1>
                {Menu.map((item) => (
                    path === item.link && <ContentCommerce key={item.link} />
                ))}
            </Maincontent>
        </div>
    )
}