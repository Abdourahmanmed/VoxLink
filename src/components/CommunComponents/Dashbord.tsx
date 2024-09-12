import { MyBetterChart } from "../MyBetterChart";
import { Agents, AgentsColumns } from "../Superviseur/Culumns/CulumnsAgents";
import { Dashbordata, DashbordColumns } from "../Superviseur/Culumns/DashCulumns";
import { TableWithOutFilter } from "../TableWithOutFilter";
import BoxInfoDetails from "./BoxInfoDetails/BoxInfoDetails";

export default function Dashbord() {
    //test compagner
    const CompagneData: Dashbordata[] = [
        {
            id: "1",
            Nom: "Recouvrement",
        },
        {
            id: "2",
            Nom: "Amazone",
        },
        {
            id: "3",
            Nom: "Esuuq",
        },
        {
            id: "4",
            Nom: "Colis Ems",
        },
    ];
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
        <main className="w-full">
            {/* the box information */}
            <div className="flex w-full flex-wrap gap-20">
                <BoxInfoDetails title="Nombres des appelles totals" total="22" color="blue"  key={1}/>
                <BoxInfoDetails title="Nombres des appelles positive" total="15" color="green-500" key={2} />
                <BoxInfoDetails title="Nombres des appelles negative" total="7" color="red-500"  key={3}/>
            </div>
            {/* charte and table of compagne */}
            <div className="flex gap-4">
                <div className="w-2/3 py-4">
                    <MyBetterChart />
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
