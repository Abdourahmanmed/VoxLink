'use client';
import CreateUser from "../FormUser";
import { ReUsableDataTableCrud } from "../ReUsableDataTableCrud";
import { Agents, AgentsColumns } from "../Superviseur/Culumns/CulumnsAgents";

export default function CrudAgent() {
    //test agents data
    const AgentsData: Agents[] = [
        {
            id: '1',
            Nom: "Donald Trump",
            Email: "Donal@gmail.com",
            Telephone: 77323110,
            Adresse: "quartier 2",
        }
    ];
    
    return (
        <div>
            <ReUsableDataTableCrud data={AgentsData} columns={AgentsColumns} typeName="Nom" poptitle="Ajouter un agent" children={<CreateUser />} />
        </div>
    )
}