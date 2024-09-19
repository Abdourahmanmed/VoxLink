'use client';
import { useEffect, useState } from "react";
import CreateUser from "../FormUser";
import { ReUsableDataTableCrud } from "../ReUsableDataTableCrud";
import { Agents, AgentsColumns } from "../Superviseur/Culumns/CulumnsAgents";
import { z } from "zod";
import { RegisterSchema } from "@/Schemas";
import { useAppContext } from "../context/AppContext";

export default function CrudAgent() {
    //state 
    const {UsersData ,SetUsersData,onSubmitUtilisateur,successMessage,errorMessage} = useAppContext();
    //comportement
    //fonction qui permet de recupere les status des apples surtout les appelle positves 
    const FetchStatus = async () => {
        const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=AfficherPourSuperviseur`;
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
            })
            const responseData = await response.json();

            if (!response.ok || responseData.error) {
                console.log(responseData.error || "Une erreur réseau a été détectée.");
            } else {
                SetUsersData(responseData);
                console.log(responseData);
            }

        } catch (error) {
            console.log('Erreur : ', error);
        }
    }
    useEffect(() => {
        FetchStatus();
    }, [])
    //render
    return (
        <div>
            <ReUsableDataTableCrud data={UsersData} columns={AgentsColumns} typeName="Nom" poptitle="Ajouter un utilisateur" children={<CreateUser onSubmit={onSubmitUtilisateur} successMessage={successMessage} errorMessage={errorMessage} />} />
        </div>
    )
}