import { usePathname } from "next/navigation"
import Dashbord from "../CommunComponents/Dashbord";
import Affectation from "./Affectation";
import CrudAgent from "../CommunComponents/CrudAgents";
import DataImported from "./DataImported";
import StateCAll from "./StateCall";
import Reporte from "./Report";
import CrudCompagner from "../CommunComponents/CrudCompagner";
import Reacffectation from "./Reacffectation";
import SupQuickPoste from "./SupQuickPoste";

export default function SupContent() {
    const path = usePathname();
    return (
        <>
            {/* // le dashbord */}
            {path && path === "/Superviseur/Dashbord" && (
                <Dashbord />
            )}

            {/* // le affectation */}
            {path && path === "/Superviseur/Affectation" && (
                <Affectation />
            )}
            {/* // le Reaffectation */}
            {path && path === "/Superviseur/ReAffectation" && (
                <Reacffectation />
            )}

            {/* //agents */}
            {path && path === "/Superviseur/Agents" && (
                <CrudAgent />
            )}

            {/* // donner importer */}
            {path && path === "/Superviseur/Donne_importer" && (
                <DataImported />
            )}


            {/* //status des appelles  */}
            {path && path === "/Superviseur/status_des_appelles" && (
                <StateCAll />
            )}

            {/* // raport  */}
            {path && path === "/Superviseur/Rapport" && (
                <Reporte />
            )}

            {/* // compagner  */}
            {path && path === "/Superviseur/Compagner" && (
                <CrudCompagner />
            )}
            {/* // compagner  */}
            {path && path === "/Superviseur/QuicPoste" && (
                <SupQuickPoste />
            )}
        </>
    )
}