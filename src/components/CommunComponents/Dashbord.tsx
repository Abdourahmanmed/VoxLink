import { useEffect, useState } from "react";
import { MyBetterChart } from "../MyBetterChart";
import { Agents, AgentsColumns } from "../Superviseur/Culumns/CulumnsAgents";
import { Dashbordata, DashbordColumns } from "../Superviseur/Culumns/DashCulumns";
import { TableWithOutFilter } from "../TableWithOutFilter";
import BoxInfoDetails from "./BoxInfoDetails/BoxInfoDetails";

export default function Dashbord() {
    //state 
    const [CompagneData, SetCompagneData] = useState<Dashbordata[]>([])
    const [AgentsData, SetAgentsData] = useState<Agents[]>([])
    const [CallTotalData, SetCallTotalData] = useState(0);
    const [NegativeCallTotalData, SetNegativeCallTotalData] = useState(0);
    const [PositiveCallTotalData, SetPositiveCallTotalData] = useState(0);

    //comportement

    //fonction qui afficher les nombres total des appelles 
    const fetchCallTotalData = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=NombreAppelsParAn`;
        try {
            const response = await fetch(apiUrl, {
                method: 'GET'
            })
            if (!response.ok) {
                console.log('Erreur d\'execurion de la requete');
            }
            const responseData = await response.json();
            if (responseData.error) {
                console.log(responseData.error);
            }
            SetCallTotalData(responseData.total_appels_an);

        } catch (error) {
            console.log(error);
        }
    }
    //fonction qui afficher les nombres total des appelles negative
    const fetchNegativeCallTotalData = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=NombreAppelsNegativeParAn`;
        try {
            const response = await fetch(apiUrl, {
                method: 'GET'
            })
            if (!response.ok) {
                console.log('Erreur d\'execurion de la requete');
            }
            const responseData = await response.json();
            if (responseData.error) {
                console.log(responseData.error);
            }
            SetNegativeCallTotalData(responseData.total_appels_negative_an);

        } catch (error) {
            console.log(error);
        }
    }
    //fonction qui afficher les nombres total des appelles  positive
    const fetchPositiveCallTotalData = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=NombreAppelsPositiveParAn`;
        try {
            const response = await fetch(apiUrl, {
                method: 'GET'
            })
            if (!response.ok) {
                console.log('Erreur d\'execurion de la requete');
            }
            const responseData = await response.json();
            if (responseData.error) {
                console.log(responseData.error);
            }
            SetPositiveCallTotalData(responseData.total_appels_positive_an);

        } catch (error) {
            console.log(error);
        }
    }

    //fonction qui afficher le 5 premier compagne
    const fetchCompagneData = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AfficherCompagneLimiteDe5`;
        try {
            const response = await fetch(apiUrl, {
                method: 'GET'
            })
            if (!response.ok) {
                console.log('Erreur d\'execurion de la requete');
            }
            const responseData = await response.json();
            if (responseData.error) {
                console.log(responseData.error);
            }
            SetCompagneData(responseData);

        } catch (error) {
            console.log(error);
        }
    }

    //fonction qui afficher le 5 premier utilisateur 
    const fetchAgentsData = async () => {
        const apiUrl = `http://192.168.100.4:8080/Vox_Backend//api.php?method=AfficherPourSuperviseurLimit5`;
        try {
            const response = await fetch(apiUrl, {
                method: 'GET'
            })
            if (!response.ok) {
                console.log('Erreur d\'execurion de la requete');
            }
            const responseData = await response.json();
            if (responseData.error) {
                console.log(responseData.error);
            }
            SetAgentsData(responseData);

        } catch (error) {
            console.log(error);
        }
    }

    // le useEffect 
    useEffect(() => {
        fetchCallTotalData();
        fetchNegativeCallTotalData();
        fetchPositiveCallTotalData();
        fetchCompagneData();
        fetchAgentsData();
    }, [])

    //render
    return (
        <main className="w-full">
            {/* the box information */}
            <div className="flex w-full flex-wrap gap-20">
                <BoxInfoDetails title="Nombres des appelles totals" total={CallTotalData} color="blue" SetCallData={SetCallTotalData} type="Total" key={1} />
                <BoxInfoDetails title="Nombres des appelles positive" total={PositiveCallTotalData} SetCallData={SetPositiveCallTotalData} type="Positive" color="green-500" key={2} />
                <BoxInfoDetails title="Nombres des appelles negative" total={NegativeCallTotalData} SetCallData={SetNegativeCallTotalData} type="Negative" color="red-500" key={3} />
            </div>
            {/* charte and table of compagne */}
            <div className="flex gap-4">
                <div className="w-2/3 py-4">
                    <MyBetterChart CallTotalData={CallTotalData} PositiveCallTotalData={PositiveCallTotalData} NegativeCallTotalData={NegativeCallTotalData} />
                </div>
                <div className="w-2/3 py-4">
                    <div className="bg-blanc w-full p-4 rounded-lg shadow-blue">
                        {/* Correction: inversion des paramètres data et columns */}
                        <h1 className="text-blue text-2xl font-semibold p-4">Le compagne</h1>
                        <TableWithOutFilter data={CompagneData} columns={DashbordColumns} />
                        <div className="flex justify-end py-4">
                            <a href="/Superviseur/Compagner">
                                <button className="text-white w-max h-max p-2 bg-blue hover:bg-blue/90 duration-500 rounded-lg ">voir plus</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/* table of users in the systhem */}
            <div className="w-full bg-blanc shadow-blue p-2 rounded-lg">
                <TableWithOutFilter data={AgentsData} columns={AgentsColumns} />
                <div className="flex justify-end py-4">
                    <a href="/Superviseur/Agents">
                        <button className="text-white w-max h-max p-2 bg-blue hover:bg-blue/90 duration-500 rounded-lg ">voir plus</button>
                    </a>
                </div>
            </div>

        </main>
    );
}
