"use client";
import Sidebar from "../Sidebar";
import { Building2, Database, FileChartColumnIncreasing, LayoutDashboard ,  Users , } from 'lucide-react';
import Maincontent from "../Maincontent";
import { usePathname } from "next/navigation";
import SupContent from "./SupContent";

const Menu = [
    { title: "Dashbord", icon: <LayoutDashboard  />, link: "/Superviseur/Dashbord" },
    { title: "Affectation", icon: < Users  />, link: "/Superviseur/Affectation" },
    { title: "Agents", icon: < Users  />, link: "/Superviseur/Agents" },
    { title: "Compagner", icon: < Users  />, link: "/Superviseur/Compagner" },
    { title: "Donne importer", icon: <Database  />, link: "/Superviseur/Donne_importer" },
    { title: "status des appelles", icon: < FileChartColumnIncreasing  />, link: "/Superviseur/status_des_appelles" },
    { title: "Rapport", icon: < Building2   />, link: "/Superviseur/Rapport" },
   
];

export default function Superviseur() {
    const path = usePathname();
    return (
        <div className="flex">
            <Sidebar menu={Menu} titre="Superviseur" />
            <Maincontent>
                <h1 className="text-xl font-medium py-4 text-blue">{path.replace(/^\/+/, '')}</h1>
                <SupContent />
            </Maincontent>
        </div>
    )
}