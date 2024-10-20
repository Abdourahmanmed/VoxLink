"use client";
import { useEffect, useState } from "react";
import { FormError } from "../FormError";
import { FormSucces } from "../FormSucces";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Agents } from "./Culumns/CulumnsAgents";
import { DataTableRepartition } from "./RepartitionData";
import { Report, ReportColumns } from "./Culumns/CulumnReport";
import { Repartition, RepartitionColumns } from "./Culumns/RepartionColumn";

export default function Repartition_des_contacts() {
    // State
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [selectedAgent, setSelectedAgent] = useState<string>("");
    const [agents, setAgents] = useState<Agents[]>([]);
    const [statusAppel, setStatusAppel] = useState<Repartition[]>([]);

    // Comportement
    const fetchAgents = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend/api.php?method=AfficherPourSuperviseurTele`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Erreur lors de l'exécution de la requête.");

            const responseData = await response.json();
            if (responseData.error) throw new Error("Erreur du serveur: " + responseData.error);

            setAgents(responseData);
        } catch (error) {
            console.error("Erreur lors de la récupération des agents:", error);
            setErrorMessage("Impossible de charger les agents.");
        }
    };

    const fetchAgentsTeleconseil = async (id: number) => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend/api.php?method=RepartitionContact&id=${id}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Erreur lors de l'exécution de la requête.");

            const responseData = await response.json();
            if (responseData.error) throw new Error("Erreur du serveur: " + responseData.error);

            setStatusAppel(responseData);
        } catch (error) {
            console.error("Erreur lors de la récupération des agents:", error);
            setErrorMessage("Impossible de charger les agents.");
        }
    };

    // useEffect pour charger les agents au premier rendu
    useEffect(() => {
        fetchAgents();
    }, []);

    // useEffect pour charger les contacts lorsque l'agent sélectionné change
    useEffect(() => {
        if (selectedAgent) {
            fetchAgentsTeleconseil(parseInt(selectedAgent)); // Conversion en nombre
        }
    }, [selectedAgent]);

    // Render
    return (
        <div className="w-full p-4 flex flex-col gap-8">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-1/3 shadow-blue">
                    <SelectValue placeholder="Sélectionner un agent" />
                </SelectTrigger>
                <SelectContent className="text-blue">
                    {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id.toString()}> {/* Convertir l'ID en chaîne */}
                            {agent.Nom}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Affichage des messages */}
            <FormSucces message={successMessage} />
            <FormError message={errorMessage} />

            {/* Liste des contacts affectés par le téléconseiller choisi */}
            <DataTableRepartition data={statusAppel} columns={RepartitionColumns} typeName="Nom" />
        </div>
    );
}
