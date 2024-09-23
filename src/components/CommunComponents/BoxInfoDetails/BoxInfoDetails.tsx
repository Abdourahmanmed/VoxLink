import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical } from 'lucide-react';


interface BoxInfo {
    title: string
    total: number
    color: string
    SetCallData: (data: number) => void
    type: string
}
export default function BoxInfoDetails({ title, total, color, SetCallData, type }: BoxInfo) {

    //condition

    if (type == "Total") {
        //comportement 
        const ParJourData = async () => {
            const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=NombreAppelsParJour`;
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
                SetCallData(responseData.total_appels_jour);

            } catch (error) {
                console.log(error);
            }
        }
        const ParSemaineData = async () => {
            const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=NombreAppelsParSemaine`;
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
                SetCallData(responseData.total_appels_semaine);

            } catch (error) {
                console.log(error);
            }
        }
        const ParMoisData = async () => {
            const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=NombreAppelsParMois`;
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
                SetCallData(responseData.total_appels_mois);

            } catch (error) {
                console.log(error);
            }
        }
        const ParAnsData = async () => {
            const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=NombreAppelsParAn`;
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
                SetCallData(responseData.total_appels_an);

            } catch (error) {
                console.log(error);
            }
        }


        //render
        return (
            <div className="h-[100px] w-[300px] bg-blanc flex flex-col items-center shadow-blue">
                <div className="p-2 flex justify-between gap-4">
                    <h1 className="text-blue text-md font-semibold">{title}</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger><EllipsisVertical className="text-blue h-[16px]" /></DropdownMenuTrigger>
                        <DropdownMenuContent className="text-blue">
                            <DropdownMenuLabel>Filtrage</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={ParJourData}>Par jour</DropdownMenuItem>
                            <DropdownMenuItem onClick={ParSemaineData}>Par semaine</DropdownMenuItem>
                            <DropdownMenuItem onClick={ParMoisData}>Par mois</DropdownMenuItem>
                            <DropdownMenuItem onClick={ParAnsData}>Par ans</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
                <div className="flex justify-center items-center p-2">
                    <span className={`text-4xl text-${color}`}>{total}</span>
                </div>
            </div>
        )
    }

    if (type == "Positive") {
        //comportement 
        const ParJourData = async () => {
            const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=NombreAppelsPositiveParJour`;
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
                SetCallData(responseData.total_appels_positive_jour);

            } catch (error) {
                console.log(error);
            }
        }
        const ParSemaineData = async () => {
            const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=NombreAppelsPositiveParSemaine`;
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
                SetCallData(responseData.total_appels_positive_semaine);

            } catch (error) {
                console.log(error);
            }
        }
        const ParMoisData = async () => {
            const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=NombreAppelsPositiveParMois`;
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
                SetCallData(responseData.total_appels_positive_mois);

            } catch (error) {
                console.log(error);
            }
        }
        const ParAnsData = async () => {
            const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=NombreAppelsPositiveParAn`;
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
                SetCallData(responseData.total_appels_positive_an);

            } catch (error) {
                console.log(error);
            }
        }


        //render
        return (
            <div className="h-[100px] w-[300px] bg-blanc flex flex-col items-center shadow-blue">
                <div className="p-2 flex justify-between gap-4">
                    <h1 className="text-blue text-md font-semibold">{title}</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger><EllipsisVertical className="text-blue h-[16px]" /></DropdownMenuTrigger>
                        <DropdownMenuContent className="text-blue">
                            <DropdownMenuLabel>Filtrage</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={ParJourData}>Par jour</DropdownMenuItem>
                            <DropdownMenuItem onClick={ParSemaineData}>Par semaine</DropdownMenuItem>
                            <DropdownMenuItem onClick={ParMoisData}>Par mois</DropdownMenuItem>
                            <DropdownMenuItem onClick={ParAnsData}>Par ans</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
                <div className="flex justify-center items-center p-2">
                    <span className={`text-4xl text-${color}`}>{total}</span>
                </div>
            </div>
        )
    }
    
    if (type == "Negative") {
        //comportement 
        const ParJourData = async () => {
            const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=NombreAppelsNegativeParJour`;
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
                SetCallData(responseData.total_appels_negative_jour);

            } catch (error) {
                console.log(error);
            }
        }
        const ParSemaineData = async () => {
            const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=NombreAppelsNegativeParSemaine`;
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
                SetCallData(responseData.total_appels_negative_semaine);

            } catch (error) {
                console.log(error);
            }
        }
        const ParMoisData = async () => {
            const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=NombreAppelsNegativeParMois`;
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
                SetCallData(responseData.total_appels_negative_mois);

            } catch (error) {
                console.log(error);
            }
        }
        const ParAnsData = async () => {
            const apiUrl = `http://127.0.0.1/Vox_Backend/api.php?method=NombreAppelsNegativeParAn`;
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
                SetCallData(responseData.total_appels_negative_an);

            } catch (error) {
                console.log(error);
            }
        }


        //render
        return (
            <div className="h-[100px] w-[300px] bg-blanc flex flex-col items-center shadow-blue">
                <div className="p-2 flex justify-between gap-4">
                    <h1 className="text-blue text-md font-semibold">{title}</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger><EllipsisVertical className="text-blue h-[16px]" /></DropdownMenuTrigger>
                        <DropdownMenuContent className="text-blue">
                            <DropdownMenuLabel>Filtrage</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={ParJourData}>Par jour</DropdownMenuItem>
                            <DropdownMenuItem onClick={ParSemaineData}>Par semaine</DropdownMenuItem>
                            <DropdownMenuItem onClick={ParMoisData}>Par mois</DropdownMenuItem>
                            <DropdownMenuItem onClick={ParAnsData}>Par ans</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
                <div className="flex justify-center items-center p-2">
                    <span className={`text-4xl text-${color}`}>{total}</span>
                </div>
            </div>
        )
    }


}