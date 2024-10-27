"use client";
import Sidebar from "../Sidebar";
import { ArrowRight, Building2, ClipboardPen, Database, FileChartColumnIncreasing, FileX2, LayoutDashboard, LayoutList, Megaphone, RefreshCcw, Users, } from 'lucide-react';
import Maincontent from "../Maincontent";
import { usePathname } from "next/navigation";
import SupContent from "./SupContent";

const Menu = [
    { title: "Dashbord", icon: <LayoutDashboard />, link: "/Superviseur/Dashbord" },
    { title: "Affectation", icon: <ArrowRight />, link: "/Superviseur/Affectation" },
    { title: "ReAffectation", icon: <RefreshCcw />, link: "/Superviseur/ReAffectation" },
    { title: "Répartition des Contacts", icon: <LayoutList />, link: "/Superviseur/Repartition_des_Contacts" },
    { title: "Agents", icon: <Users />, link: "/Superviseur/Agents" },
    { title: "Compagner", icon: <Megaphone />, link: "/Superviseur/Compagner" },
    { title: "Donne importer", icon: <Database />, link: "/Superviseur/Donne_importer" },
    { title: "status des appelles", icon: <FileChartColumnIncreasing />, link: "/Superviseur/status_des_appelles" },
    { title: "Rapport", icon: <Building2 />, link: "/Superviseur/Rapport" },
    { title: "Quick Poste", icon: <ClipboardPen />, link: "/Superviseur/QuicPoste" },
    { title: "Historique", icon: <FileX2 />, link: "/Superviseur/Historique" },
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